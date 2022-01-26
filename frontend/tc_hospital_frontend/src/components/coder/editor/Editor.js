import React, {useState, useRef, useEffect} from "react";
import { fromRange } from "xpath-range"
import { v4 as uuidv4 } from 'uuid';

import Navbar from "../../general/navbar/Navbar";
import UploadFadeIn from "./UploadFadeIn";

import '../../../styles/shared/main.css';
import '../../../styles/shared/editor/editor.css';

import {} from "../../../slice/authSlice";
import {codeCompletionAsync, uploadCodeAsync} from "../../../slice/reviewSlice";
import {history} from "../../../helpers/history";


import {useDispatch} from "react-redux";

const Editor = () => {

    const [insertTxtStage, setInsertTxtStage] = useState(true);
    const [txt, setTxt] = useState("");
    const [selTxt, setSelTxt] = useState({})
    const [tempCodes, setTempCodes] = useState([])
    const [finalUploadStage, setFinalUploadStage] = useState(false)

    const dispatch = useDispatch();

    //todo security checks

    /**
     * @function (01) ensure that the empty sign has the correct height
     */
    useEffect(() => {
        //01
        document.getElementsByClassName('empty_editor')[0].style.height = document.getElementsByClassName('code_input')[0].offsetHeight+'px'
    }, [])

    /**
     * @function (01) define the target by choosing the complementary of the scrolled div
     *           (02) assign scroll toü and scroll left to the target based on the event scrolled position
     */
    const syncScroll = (e, origin) => {
        //01
        const target = origin === 'display' ? document.getElementsByClassName('code_input')[0] : document.getElementsByClassName('code_display')[0]
        //02
        target.scrollTop = e.currentTarget.scrollTop;
        target.scrollLeft = e.currentTarget.scrollLeft;
    }

    //==================================================

    /**
     * @function (01) check that there is no overlapping regarding the codes
     *           (02) highlight the code
     *           (03) push into data structure (updates the code overview on the right side)
     */
    const addCode = () => {
        //01
        let startOverlapCheck = tempCodes.filter(code => selTxt.start > code.start && selTxt.start < code.end)
        let endOverlapCheck = tempCodes.filter(code => selTxt.end < code.end && selTxt.end > code.start)
        //todo check that this code has not been used yet
        if (startOverlapCheck.length > 0 || endOverlapCheck.length > 0) return alert('No overlaps possbile')
        //02
        setSelectionRange(selTxt.start, selTxt.end)
        //highlight("yellow");
        //03
        setTempCodes(currentCodes => [...currentCodes, selTxt]);
    }

    /**
     * @function (00) wait until typing ended and dispatch send to backend for code completion and wait
     *           (01) duplicate the array
     *           (02) find the array entry by index
     *           (03) add code to this entry
     * @param e is the event
     * @param i is the index of the array element which is
     * @param type either id or desc of the code - required for the autocompletion
     */
    let typingTimerEdit;
    const editCode = (e, i, type) => {
        //00
        clearTimeout(typingTimerEdit);
        if (!e.target.value) return;
        typingTimerEdit = setTimeout(() => {
            dispatch(codeCompletionAsync({type: type, val: e.target.value}))
                .then((res) => {
                    if (res.payload.matches.length !== 1) {
                        document.getElementsByClassName('ind_code_display')[i].style.border = "1px solid red";
                        return document.getElementsByClassName('large_code_section')[i].value = 'Zu viele Ergebnisse - '+res.payload.matches.length
                    }
                    //01
                    let newArr = [...tempCodes];
                    //02
                    let mergedObj = {...newArr[i], icdCode: e.target.value, icdCodeDesc: res.payload.matches[0][2]}
                    newArr[i] = mergedObj;
                    //03
                    setTempCodes(newArr);
                    //04
                    document.getElementsByClassName('large_code_section')[i].value = res.payload.matches[0][2]
                    //05
                    document.getElementsByClassName('ind_code_display')[i].style.border = "none";
                })
                .catch((err) => {
                    console.log(err)
                });
        }, 200);
    }

    /**
     * @function (01) duplicate the array
     *           (02) splice the array
     *           (03) set the new temp codes
     * @param i index of the highlight which is deleted
     */
    const removeTxt = (i) => {
        let newArr = [...tempCodes];
        //02
        newArr.splice(i, 1);
        //03
        setTempCodes(newArr);
    }

    //==================================================

    //todo next section

    /**
     * @function (01) get all selects and positions
     *           (02) if only cursor change takes place only hide the tooltip
     *           (03) reposition tooltip
     *           (04) set selected text state
     */
    const selector = (e) => {
        //01
        let select = window.getSelection(),
            selectRange = select.getRangeAt(0),
            selectPos = selectRange.getBoundingClientRect(),
            codeInput = document.getElementsByClassName('code_input')[0],
            codeInputPos = codeInput.getBoundingClientRect(),
            tooltip = document.getElementById('tooltip_editor_wrapper');
        //02
        if (selectPos.width < 1) return tooltip.style.display = "none";
        //03
        tooltip.style.display = "inline";
        tooltip.style.top = (selectPos.top - codeInputPos.top - tooltip.offsetHeight - 10 + codeInput.scrollTop)+'px';
        tooltip.style.left = (selectPos.left - codeInputPos.left + selectPos.width/2 - tooltip.offsetWidth / 2)+'px';
        //04
        let xpath = fromRange(selectRange, codeInput)

        setSelTxt({...selTxt,  ...{
                val: selectRange.toString(),
                start: xpath.startOffset,
                end: xpath.endOffset,
                id: uuidv4(),
                top: selectPos.top - codeInputPos.top + codeInput.scrollTop - 5
            },
        })
    }

    /**
     * @function (01)
     *           (02)
     * @param start
     * @param end
     */
    function setSelectionRange(start, end) {

        let el = document.getElementsByClassName('code_input')[0];

        var range = document.createRange();
        range.selectNodeContents(el);
        var textNodes = getTextNodesIn(el);
        var foundStart = false;
        var charCount = 0, endCharCount;

        for (var i = 0, textNode; textNode = textNodes[i++]; ) {
            endCharCount = charCount + textNode.length;
            if (!foundStart && start >= charCount && (start < endCharCount || (start == endCharCount && i <= textNodes.length))) {
                range.setStart(textNode, start - charCount);
                foundStart = true;
            }
            if (foundStart && end <= endCharCount) {
                range.setEnd(textNode, end - charCount);
                break;
            }
            charCount = endCharCount;
        }

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        //Helper functions

        function getTextNodesIn(node) {
            var textNodes = [];
            if (node.nodeType === 3) {
                textNodes.push(node);
            } else {
                var children = node.childNodes;
                for (var i = 0, len = children.length; i < len; ++i) {
                    textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
                }
            }
            return textNodes;
        }
    }

    /**
     * @function
     * @param colour
     */
    function highlight(colour) {

        let range, sel;

        sel = window.getSelection();
        if (sel.rangeCount && sel.getRangeAt) {
            range = sel.getRangeAt(0);
        }
        document.designMode = "on";
        sel.removeAllRanges();
        sel.addRange(range);
        document.execCommand("BackColor", false, colour);
        document.designMode = "off";
    }

    //==================================================

    /**
     * @function (00) check if the div has any type of input
     *           (01) update the state of the of the insertTxtStage
     *           (02) adjust the heights
     */
    const endEditMode = () => {
        //00
        if (txt === "") return alert('we need some text')
        //01
        setInsertTxtStage(false);
        //02
        document.getElementById('internal_code_display').style.height = document.getElementsByClassName('code_input')[0].scrollHeight+'px';
    }

    /**
     * @function (01) update the current text
     *           (02) if the text is empty
     */
    const addTxt = (e) => {
        //01
        setTxt(e.currentTarget.innerHTML)
        //02
        if (e.currentTarget.innerHTML   === "") e.currentTarget.innerHTML = "copy & paste patient record and anonymize it"
    }

    /**
     * @function (01) prevent the default behavior
     *           (02) select the clipboard
     *           (03) insert the plain text
     *           (04) update the txt variable
     */
    const pasteTxt = (e) => {
        //01
        e.preventDefault();
        let content;
        //02
        if (e.clipboardData) {
            //03
            content = (e.originalEvent || e).clipboardData.getData('text/plain');
            document.execCommand('insertText', false, content);
        } else if (window.clipboardData) {
            //03
            content = window.clipboardData.getData('Text');
            document.selection.createRange().pasteHTML(content);
        }
        //04
        setTxt(content)
    }

    //==================================================

    /**
     * @function (01) check if any codes were added - if not return + that every code has an icd code allocated
     *           (02) fade in the final upload overview - where tags, difficulty, internal use and title are provided
     */
    const proceedUpload = () => {
        //01
        if (tempCodes.length < 1) return alert("please provide at least one code");
        if (tempCodes.filter(code => !code.hasOwnProperty('icdCode') || code.icdCode === "").length !== 0) return alert("allocate icd code");
        //02
        setFinalUploadStage(true);
    }

    /**
     * @function (01) prevent default
     *           (02) create a merged object of text, codes
     *           (03) upload via dispatch and wait for success
     *           (04) on success clear the view and let user create a new - reset the inital state
     */
    const uploadCodes = (e) => {
        //01
        e.preventDefault();
        setFinalUploadStage(false);
        //02
        let codeDataObj = {initialCodes: tempCodes, txt: txt, ...Object.fromEntries(new FormData(e.target))}
        //03
        dispatch(uploadCodeAsync(codeDataObj))
            .then((res) => {
                //04
                window.location.reload();
            })
            .catch((err) => {
                console.log('error', err)
            })
    }

    // ==========================

    return (
        <div className="center_container">
            <Navbar />
            <div className="main_center_content_wrapper">

                <div className="main_outer_content">
                    <div className="main_outer_heading">Code editor</div>
                </div>

                <div className="main_center_content">
                    <div className="code_input" onPaste={(e) => pasteTxt(e)} placeholder="Copy & paste patient record and anonymize it in the editor..." onKeyUp={insertTxtStage && addTxt} contentEditable={insertTxtStage ? "true" : "false"} onMouseUp={!insertTxtStage && selector} onScroll={(e) => syncScroll(e, 'input')}>
                        {!insertTxtStage &&
                            <div id="tooltip_editor_wrapper">
                                <div className="tooltip_btn" onClick={addCode}>Code hinzufügen</div>
                            </div>
                        }
                    </div>
                    <div className="code_display">
                        <div id="internal_code_display" onScroll={(e) => syncScroll(e, 'input')}>
                        {
                            tempCodes.length > 0 ? (
                                tempCodes.map((code, i) => {
                                    return <div className="ind_code_display" id={code.id} style={{top:code.top+'px'}} key={i}>
                                        <input placeholder="Code ID" className="small_code_section" onChange={(e) => editCode(e, i, 'id')}/>
                                        <input placeholder="Code Desc" className="large_code_section" readOnly/>
                                        <div className="remove_code_btn" onClick={() => removeTxt(i)}>X</div>
                                    </div>;
                                })
                            ) : (
                                <div className="empty_editor">{!insertTxtStage ? (<span>Assign codes</span>) : (<span>Finalize editing the patient record</span>)}</div>
                            )
                        }
                        </div>
                    </div>
                    {finalUploadStage && <UploadFadeIn submit = {uploadCodes} close = {() => setFinalUploadStage(false)}/>}
                </div>

                <div className="main_outer_content right_bound_outer_content">
                    {!finalUploadStage && <div className="editor_submit_btn highlighted_editor_submit_btn" onClick={() => insertTxtStage ? endEditMode() : proceedUpload()}>{insertTxtStage ? <span>Proceed</span> : <span>Upload</span>}</div>}
                </div>
            </div>
        </div>
    );
};

export default Editor;

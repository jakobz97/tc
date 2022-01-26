import React, {useEffect, useState} from "react";

import '../../../styles/shared/editor/editor.css';
import '../../../styles/shared/fadein.css';

import {codeCompletionAsync, uploadStudentCodeAsync} from "../../../slice/reviewSlice";

import {fromRange} from "xpath-range";
import {v4 as uuidv4} from "uuid";

import {useDispatch} from "react-redux";
import {history} from "../../../helpers/history";

const Editor = ({ close, taskData }) => {

    const [selTxt, setSelTxt] = useState({})
    const [tempCodes, setTempCodes] = useState([])
    const [loadedTxt, setLoadedTxt] = useState(false)

    const dispatch = useDispatch();

    /**
     * @function (01) get the dark background, the content wrapper and the inputs
     *           (02) increase the dark background opacity
     *           (03) fade up the content wrapper
     *           =============
     *           (04) insert the feature rich txt
     *           (05) show the tooltip
     *           (06) ensure that the code display has the same length as the overflow text
     *           (07) ensure that the empty codes text is centered
     */
    useEffect(() => {
        //01
        let bg = document.querySelector('.menu_dark_bg'),
            content = document.querySelector('.create_input_wrapper');
        //02
        bg.style.cssText = "opacity: 100%";
        //03
        content.style.marginTop = "0";
        //04
        document.getElementsByClassName('code_input')[0].innerHTML = taskData.txt;
        //05
        setLoadedTxt(true);
        //06
        document.getElementById('internal_code_display').style.height = document.getElementsByClassName('code_input')[0].scrollHeight+'px';
        //07
        document.getElementsByClassName('empty_editor')[0].style.height = document.getElementsByClassName('code_input')[0].offsetHeight+'px'
    }, [])

    /**
     * @function (01) get the background and content
     *           (02) return if user clicked on the content
     *           (03) user clicked outside of content - hide
     *           (04) after timeout set state again to hidden
     */
    const hideCreateView = (e, forced) => {
        //01
        let bg = document.querySelector('.menu_dark_bg'),
            content = document.querySelector('.create_input_wrapper');
        //02
        if (!forced && content.contains(e.target)) return;
        //03
        bg.style.cssText = "opacity: 0%";
        content.style.marginTop = "150vh";
        //04
        setTimeout(() => close(), 350)
    };

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

    //====================================================================

    /**
     * @function (01) check that there is no overlapping regarding the codes
     *           (02) highlight the code
     *           (03) push into data structure (updates the code overview on the right side)
     */
    const addCode = () => {
        //01
        let startOverlapCheck = tempCodes.filter(code => selTxt.start > code.start && selTxt.start < code.end)
        let endOverlapCheck = tempCodes.filter(code => selTxt.end < code.end && selTxt.end > code.start)
        if (startOverlapCheck.length > 0 || endOverlapCheck.length > 0) return alert('No overlaps possbile')
        //02
        setSelectionRange(selTxt.start, selTxt.end)
        //highlight("yellow");
        //03
        setTempCodes(currentCodes => [...currentCodes, selTxt]);
    }

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
                top: selectPos.top - codeInputPos.top + codeInput.scrollTop - 5,
                id: uuidv4()
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

    //====================================================================

    /**
     * @function (00) wait until typing ended and dispatch send to backend for code completion and wait - if more than one is found throw error
     *           (01) duplicate the array
     *           (02) find the array entry by index
     *           (03) add code to this entry
     *           (04) add the description
     *           (05) indicate that this code is ok -> remove any border color
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

    // ====================================================================

    /**
     * @function (01) check if all temp codes were assigned - if not proceed and let user assign icd 10 code
     *           (02) upload codes to backend and perform server side comparison
     *           (03) once finished jump to the analytics page where detailed information can be obtained
     */
    const uploadStudentCode = () => {
        //01
        const nonFinishedCodes = tempCodes.filter((code, index) => !code.icdCode || code.icdCode === "")
        if (nonFinishedCodes.length > 0) return alert('not all codes were assigned');
        //02
        dispatch(uploadStudentCodeAsync({tempCodes, ...{reviewId: taskData._id}}))
            .then((res) => {
                //03
                history.push("/student/analytics/");
                window.location.reload();
            })
            .catch((err) => {
                console.log('err', err)
            })

    }

    //====================================================================

    return (
        <div className="menu_dark_bg" onClick={hideCreateView}>
            <div className="create_input_wrapper enlarged_create_input_wrapper">
                <div className="create_input_hide" onClick={(e) => {hideCreateView(e, true)}}>X</div>
                <div className="code_input enlarged_code_input" onMouseUp={selector} onScroll={(e) => syncScroll(e, 'input')}>

                    {loadedTxt && <div id="tooltip_editor_wrapper">
                        <div className="tooltip_btn" onClick={addCode}>Add code</div>
                    </div>}
                </div>
                <div className="code_display enlarged_code_display" onScroll={(e) => syncScroll(e, 'display')}>
                    <div id="internal_code_display">
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
                            <div className="empty_editor">Vergebe Codes</div>
                            )
                    }
                    </div>
                    { tempCodes.length > 0 && <div className="student_compare_btn" onClick={() => uploadStudentCode()}>Upload codes and compare</div> }
                </div>
            </div>
        </div>
    );
};

export default Editor;

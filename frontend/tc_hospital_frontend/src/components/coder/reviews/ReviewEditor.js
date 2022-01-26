import React, {useEffect, useState} from "react";

import '../../../styles/shared/editor/editor.css';
import '../../../styles/shared/fadein.css';
import accept from '../../../assets/general/accept.svg';
import decline from '../../../assets/general/decline.svg';

import {getProposalsAsync, modifyProposalsAsync} from "../../../slice/reviewSlice";
import {useDispatch, useSelector} from "react-redux";

const DetailedAnalytics = ({ data, close }) => {

    const [loadedTxt, setLoadedTxt] = useState(false);
    const [codeData, setCodeData] = useState([]);

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
     *           (08) process the provided codes to display them
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
        document.getElementsByClassName('code_input')[0].innerHTML = data.txt;
        //05
        setLoadedTxt(true)
        //06
        document.getElementById('internal_code_display').style.height = document.getElementsByClassName('code_input')[0].scrollHeight+'px';
        //07
        document.getElementsByClassName('empty_editor')[0].style.height = document.getElementsByClassName('code_input')[0].offsetHeight+'px'
        //08
        fetchProposals();
    }, [])

    /**
     * @function (01) get the background and content
     *           (02) return if user clicked on the content
     *           (03) user clicked outside of content - hide
     *           (04) after timeout set state again to hidden
     */
    const hideView = (e, forced) => {
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
     * @function (01) fetch the proposals
     *           (02) merge into state array
     */
    const fetchProposals = () => {
        dispatch(getProposalsAsync({reviewId: data._id}))
            .then((res) => {
                //02
                let proposalArr = res.payload.proposals.map(proposal => ({...proposal.proposedCode, ...{id:proposal._id, studentId: proposal.senderId}}));
                setCodeData(proposalArr)
            })
            .catch((err) => {
                console.log('err', err)
            })
    }

    /**
     * @function (01) form proposalData object
     *           (02) dispatch to the backend
     *           (03) remove the code from the local state once the dispatch was successful
     *           (04) decrement the proposal counter
     * @param code is the affected code data object
     * @param action either accept or decline of the proposal
     * @param index is the index of the proposal within the codedata data structure
     */
    const modifyProposal = (action, code, index) => {
        //01
        let codeProposal = {
            reviewId: data._id,
            tempCodes: code,
            userId: code.studentId,
            action: action,
            proposalId:code.id
        }
        //02
        dispatch(modifyProposalsAsync(codeProposal))
            .then((res) => {
                //03
                let newCodeData = [...codeData];
                newCodeData.splice(index, 1);
                setCodeData(newCodeData)
                //04


            })
            .catch((err) => {
                console.log('err', err)
            })
        //test
    }

    //====================================================================

    /**
     * @function (01) get all selects and positions
     *           (02) if only cursor change takes place only hide the tooltip
     *           (03) reposition tooltip
     *           (04) set selected text state
     */
    const selector = (e) => {
        /*
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
         */
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

    return (
        <div className="menu_dark_bg" onClick={hideView}>
            <div className="create_input_wrapper enlarged_create_input_wrapper">
                <div className="create_input_hide" onClick={(e) => {hideView(e, true)}}>X</div>
                <div className="code_input enlarged_code_input" onScroll={(e) => syncScroll(e, 'input')}>
                    {loadedTxt &&
                        <div id="tooltip_editor_wrapper">
                            <div className="tooltip_btn">Code hinzufügen</div>
                        </div>
                    }
                </div>
                <div className="code_display enlarged_code_display" onScroll={(e) => syncScroll(e, 'display')}>
                    <div id="internal_code_display">
                        {
                            codeData.length > 0 ? (
                                codeData.map((code, i) => {
                                    return <div className={"ind_code_display"} id={code.id} style={{top:code.top+'px'}} key={i}>
                                        <input placeholder="Code ID" value={code.icdCode} className="small_code_section" readOnly/>
                                        <input placeholder="Code Desc" value={code.icdCodeDesc} className="large_code_section medium_code_section" readOnly/>
                                        <img className="remove_code_btn" onClick={() => modifyProposal('decline', code, i)} src={decline} />
                                        <img className="remove_code_btn" onClick={() => modifyProposal('accept', code, i)} src={accept} />
                                    </div>;
                                })
                            ) : (
                                <div className="empty_editor">No proposals</div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailedAnalytics;

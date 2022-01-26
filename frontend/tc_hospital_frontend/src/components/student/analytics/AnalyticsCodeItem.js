import React from "react";
import pin from "../../../assets/general/share.svg";

const AnalyticsCodeItem = ({ code, proposeCode }) => {

    return (
        <div className={"ind_code_display"} id={code.id} style={{top:code.top+'px'}}>
            <input placeholder="Code ID" value={code.icdCode} className="small_code_section split_small_code_section" readOnly/>
            <input placeholder="Code Desc" value={code.icdCodeDesc} className="large_code_section split_large_code_section" readOnly/>
            {code.type === 'student' && code.hasOwnProperty('proposalEligible') && code.proposalEligible ? <img className="remove_code_btn" onClick={() => proposeCode(code)} src={pin} /> : <div className="remove_code_btn"></div>}
        </div>
    );
};

export default AnalyticsCodeItem;

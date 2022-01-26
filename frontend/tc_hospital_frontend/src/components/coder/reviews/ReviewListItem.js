import React, {useState, useRef, useEffect} from "react";

import '../../../styles/main/coder/reviews/reviewListItem.css';

const ReviewListItem = ({data, index, extView}) => {

    const [proposalMode, setProposalMode] = useState("pending")

    /**
     * @function (01) check if enough reviews were provided
     *           (02) check if threshold deviation was exceeded
     */
    useEffect(() => {
        //01
        if (data.reviewCounter < 10) return setProposalMode(10 - data.reviewCounter+" more")
        //02
        setProposalMode(data.codeDeviation > 5 ? 'review' : 'all good')
    }, [])

    return (
        <div className="review_list_item" onClick={() => extView(data)}>
            <div className="large_list_field small_list_field displayed_list_field">{new Date(data.timestamp).toLocaleDateString("de-DE")}</div>
            <div className="large_list_field displayed_list_field">{data.title}</div>
            <div className="large_list_field small_list_field displayed_list_field">{data.reviewCounter}</div>
            <div className="large_list_field small_list_field displayed_list_field">{data.proposalCounter}</div>
            <div className="large_list_field small_list_field displayed_list_field">{data.codeDeviation.toFixed(2)}</div>
            <div className="large_list_field small_list_field displayed_list_field">{proposalMode}</div>
            <div className="large_list_field small_list_field empty_list_field">open</div>
        </div>
    );
};

export default ReviewListItem;

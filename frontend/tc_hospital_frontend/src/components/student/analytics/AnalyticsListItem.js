import React from "react";

import '../../../styles/shared/analytics/analytics_list_item.css';

const AnalyticsListItem = ({ data, index, detailedView }) => {

    return (
        <div className="analytics_list_item_wrapper" onClick={() => detailedView(data)}>
            <div className="analytics_item_title">{data.review.title}</div>
            <div className="analytics_list_item_separator"></div>
            <div className="analytics_ratio_wrapper">
                <div className="analytics_ratio_desc">Date:</div>
                <div className="analytics_ratio_val">{new Date(data.studentAnswer.timestamp).toLocaleDateString("de-DE")}</div>
            </div>

            <div className="analytics_list_item_separator"></div>

            <div className="analytics_ratio_wrapper">
                <div className="analytics_ratio_desc">Total / Identified</div>
                <div className="analytics_ratio_val">{data.coderCoverage.coderCodeCounter+" / "+ data.coderCoverage.mutualCounter}</div>
            </div>
            <div className="analytics_ratio_wrapper">
                <div className="analytics_ratio_desc">Mutual:</div>
                <div className="analytics_ratio_val">{data.coderCoverage.intersect.map((elem, index )=> {return elem + '/'})}</div>
            </div>
            <div className="analytics_ratio_wrapper">
                <div className="analytics_ratio_desc">My deviation:</div>
                <div className="analytics_ratio_val">{data.coderCoverage.studentDiff.map((elem, index )=> {return elem + '/'})}</div>
            </div>
            <div className="analytics_ratio_wrapper">
                <div className="analytics_ratio_desc">Coder deviation:</div>
                <div className="analytics_ratio_val">{data.coderCoverage.coderDiff.map((elem, index )=> {return elem + '/'})}</div>
            </div>

            <div className="analytics_list_item_separator"></div>

            <div className="analytics_ratio_wrapper">
                <div className="analytics_ratio_desc">Total reviews</div>
                <div className="analytics_ratio_val">{data.studentCoverage.totalReviewCounter}</div>
            </div>
            <div className="analytics_ratio_wrapper">
                <div className="analytics_ratio_desc">Total / Avg. peer identified</div>
                <div className="analytics_ratio_val">{data.coderCoverage.coderCodeCounter+" / "+ data.studentCoverage.peerFoundCodesCounterAvg}</div>
            </div>

        </div>
    );
};

export default AnalyticsListItem;

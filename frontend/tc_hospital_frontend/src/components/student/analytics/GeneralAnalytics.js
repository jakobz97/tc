import React from "react";

import '../../../styles/shared/analytics/general_analytics.css';

const GeneralAnalytics = ({ data }) => {

    return (
        <div className="general_analytics_wrapper">
            <div className="general_analytics_info_wrapper">
                <div className="general_analytics_desc">Total achievable / Total identified</div>
                <div className="general_analytics_val_large">{data.totalCoderCodes+" / "+data.totalFoundCodes}</div>
            </div>
            <div className="general_analytics_info_wrapper">
                <div className="general_analytics_desc">Avg. # total codes / Avg. # of identified codes</div>
                <div className="general_analytics_val_large">{data.avgTotalCodes.toPrecision(1)+" / "+data.avgTotalFoundCodes.toPrecision(1)}</div>
            </div>
            <div className="general_analytics_info_wrapper">
                <div className="general_analytics_desc">Avg. number of additional codes you assign</div>
                <div className="general_analytics_val_large">{data.avgDeviations.toPrecision(1)}</div>
            </div>
        </div>
    );
};

export default GeneralAnalytics;

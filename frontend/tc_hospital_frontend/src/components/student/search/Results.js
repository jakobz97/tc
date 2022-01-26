import React from "react";

import { useSelector } from "react-redux";
import {selectSuitableUploads} from "../../../slice/reviewSlice";

import '../../../styles/main/student/search/Results.css';

const SearchResults = ({ type, title, paginate, select }) => {

    const searchResult = useSelector(selectSuitableUploads)
    const data = searchResult[type]

    return (
        <div className="search_result_container">
            <div className="search_result_desc">{title}</div>
            {
                data && data.length > 0 ? (
                    data.map((res, index) => {
                        return <div className="ind_search_result" onClick={() => {select(res)}} >
                            <div className="search_result_large">{res.title}</div>
                            <div className="search_result_small">{res.difficulty}</div>
                            <div className="search_result_small">{res.reviewCounter}</div>
                            <div className="search_result_small">{new Date(res.timestamp).toLocaleDateString("de-DE")}</div>
                        </div>
                    })
                ) : (
                    <div className="empty_search_result">Empty</div>
                )
            }
        </div>
    );
};

export default SearchResults;

import React, {useState, useRef, useEffect} from "react";

import Navbar from "../../general/navbar/Navbar";
import ReviewListItem from "./ReviewListItem";
import ReviewEditor from "./ReviewEditor";

import '../../../styles/shared/main.css';
import '../../../styles/main/coder/reviews/reviews.css';

import {} from "../../../slice/authSlice";
import {getUploadsAsync, selectCreatedUploads,} from "../../../slice/reviewSlice";

import {history} from "../../../helpers/history";
import { useDispatch, useSelector } from "react-redux";
import {Link} from "react-router-dom";

const Reviews = () => {

    const [visibleReview, setVisibleReview] = useState(false);
    const [visibleReviewData, setVisibleReviewData] = useState(false);

    const dispatch = useDispatch();
    const uploads = useSelector(selectCreatedUploads)

    //todo security checks

    /**
     * @function (01) load all documents which were uploaded by the coder + show loading spinner
     *           (02) hide loading spinner once the load was finished
     */
    useEffect(() => {
        //01
        dispatch(getUploadsAsync())
            .then((res) => {
                //02
            })
            .catch((err) => {
                console.log('err', err)
            })
    }, [])

    /**
     * @function (01) update state and set the extended view to true
     */
    const showExtReview = (data) => {
        //01
        setVisibleReview(true);
        setVisibleReviewData(data)
    }

    return (
        <div className="center_container">
            <Navbar />
            <div className="main_center_content_wrapper">
                <div className="main_outer_content">
                    <div className="main_outer_heading">Student reviews</div>
                </div>
                <div className="main_center_content">
                        {
                            uploads.length > 0 ? (
                                <div className="review_list_container">
                                    <div className="review_list_heading">
                                        <div className="large_list_field small_list_field">Date</div>
                                        <div className="large_list_field">Title</div>
                                        <div className="large_list_field small_list_field">Reviews</div>
                                        <div className="large_list_field small_list_field">Proposals</div>
                                        <div className="large_list_field small_list_field">Deviation</div>
                                        <div className="large_list_field small_list_field">Code check</div>
                                        <div className="large_list_field small_list_field empty_list_field"></div>
                                    </div>
                                    {uploads.map((upload, index) => <ReviewListItem data = {upload} index = {index} extView = {showExtReview}/>)}
                                </div>
                            ) : (
                                <Link to={"/coder/editor/"} className="empty_review_msg">You have not uploaded yet - start now</Link>
                            )
                        }
                        { visibleReview && <ReviewEditor data = {visibleReviewData} close = {() => setVisibleReview(false)}/> }
                </div>
                <div className="main_outer_content right_bound_outer_content"></div>
            </div>
        </div>
    );
};

export default Reviews;

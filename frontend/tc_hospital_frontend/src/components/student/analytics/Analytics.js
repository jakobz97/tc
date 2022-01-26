import React, {useState, useEffect} from "react";

import {useDispatch, useSelector} from "react-redux";
import {history} from "../../../helpers/history";

import {selectIsLoggedIn, selectUserType} from "../../../slice/authSlice";
import {selectUserData, getUserAsync} from "../../../slice/userSlice";
import {getReviewAnalyticsAsync} from "../../../slice/reviewSlice";

import '../../../styles/shared/main.css';
import '../../../styles/shared/analytics/analytics.css';

import Navbar from "../../general/navbar/Navbar";
import AnalyticsListItem from "../../student/analytics/AnalyticsListItem";
import DetailedAnalytics from "../../student/analytics/DetailedAnalytics";
import GeneralAnalytics from "../../student/analytics/GeneralAnalytics";

const Analytics = () => {

    const dispatch = useDispatch();

    const loggedIn = useSelector(selectIsLoggedIn);
    const userType = useSelector(selectUserType);
    const userData = useSelector(selectUserData);

    if (!loggedIn || userType !== 'student') {
        history.push("/login");
        window.location.reload();
    }

    const [reviewDataList, setReviewDataList] = useState([])
    const [globalAnalytics, setGlobalAnalytics] = useState({})
    const [visibleDetailedAnalytics, setVisibleDetailedAnalytics] = useState(false)
    const [detailedAnalyticsData, setDetailedAnalyticsData] = useState({})

    /**
     * @function (00) if user data has been loaded check if any reviews were already made - if true load the reviewed uploads
     *           (01) load answered uploads for this user - if user has ´made any reviews so far
     *           (02) hide the loading sign once fulfilled
     */
    useEffect(() => {
        //00
        if (Object.keys(userData).length > 0) {
            getAnalytics(userData.answeredUploads);
            return;
        }
        //01
        dispatch(getUserAsync())
            .then((res) => {
                getAnalytics(res.payload.userData.answeredUploads)
            })
            .catch((err) => {
                console.log('err', err)
            })
    }, [])

    // Detailed view ==============================

    /**
     * @function (01) update the state and fade in the
     * @param data
     */
    const detailedView = (data) => {
        setDetailedAnalyticsData(data)
        setVisibleDetailedAnalytics(true)

    }

    // Helper functions ===========================

    /**
     * @function (01) check if user has made any revies so far
     *           (02) load the reviews from the backend
     *           (03) assign the results to the local variables
     * @param reviewIds array of reviews [0] reviewId [1] reviewAnswerId [2] reviewAnswerSubId
     */
    const getAnalytics = (reviewIds) => {
        //01
        if (!reviewIds || reviewIds.length === 0)  console.log('No replies so far')
        //02
        dispatch(getReviewAnalyticsAsync(reviewIds))
            .then((res) => {
                setGlobalAnalytics(res.payload.globalKPIS)
                setReviewDataList(res.payload.reviewData)
            })
            .catch((err) => {
                console.log('error', err)
            })
    }

    return (
        <div className="center_container">
            <Navbar />
            <div className="main_center_content_wrapper">
                <div className="main_outer_content">
                    <div className="main_outer_heading">Analytics</div>
                </div>

                <div className="main_center_content">
                    <div className="analytics_review_wrapper">
                    {
                        reviewDataList.length > 0 ? (
                            reviewDataList.map((elem, index) => <AnalyticsListItem data = {elem} index = {index} detailedView = {detailedView} />)
                        ) : (
                            <div className="no_analytics_txt">Tackle reviews - No answers mean no analytics</div>
                        )
                    }
                    </div>
                    { reviewDataList.length > 0 && <GeneralAnalytics data = {globalAnalytics} />}
                    { visibleDetailedAnalytics && <DetailedAnalytics data = {detailedAnalyticsData}  close = {() => setVisibleDetailedAnalytics(false)}/> }
                </div>

                <div className="main_outer_content right_bound_outer_content"></div>
            </div>
        </div>
    );
};

export default Analytics;

import React, {useState, useEffect} from "react";

import {useDispatch, useSelector} from "react-redux";
import {history} from "../../../helpers/history";

import {selectIsLoggedIn, selectUserType} from "../../../slice/authSlice";
import {selectUserData, getUserAsync} from "../../../slice/userSlice";
import {getSuitableUploadsAsync} from "../../../slice/reviewSlice";

import '../../../styles/shared/main.css';
import '../../../styles/main/student/search/Search.css';

import Navbar from "../../general/navbar/Navbar";

import SearchResults from "./Results";
import Editor from "../editor/Editor";


const Search = () => {

    const dispatch = useDispatch();

    const loggedIn = useSelector(selectIsLoggedIn);
    const userType = useSelector(selectUserType);
    const userData = useSelector(selectUserData);

    const [searchIndex, setSearchIndex] = useState({
        internalIndex: 0,
        externalIndex: 0
    })
    const [visibleEditor, setVisibleEditor] = useState(false)
    const [selectedTask, setSelectedTask] = useState({})

    if (!loggedIn || userType !== 'student') {
        history.push("/login");
        window.location.reload();
    }

    /**
     * @function (00) check if user data exists in redux - if not load the data
     *           (01) load suitable tasks via dispatch
     *           (02) hide the loading sign once fulfilled
     */
    useEffect(async () => {
        //00
        if (Object.keys(userData).length === 0) dispatch(getUserAsync());
        //01
        dispatch(getSuitableUploadsAsync(searchIndex))
            .then((res) => {
                //02
            })
            .catch((err) => {
                console.log('error', err)
            })
    }, [])

    /**
     * @function (01) update the paginatiopn index counter
     *           (02) dispatch the updated suitable upload and update the redux state variable
     */
    const paginateResults = () => {

    }

    /**
     * @function (00) check if user has already answered this task
     *           (01) set the selected task data
     *           (02) make the editor visible
     * @param taskData object of the entire task
     */
    const selectTask = (taskData) => {
        //00
        if (userData.answeredUploads && userData.answeredUploads.filter(review => review[0] === taskData._id.toString()).length > 0) return alert('already answered')
        //01
        setSelectedTask({...selectedTask, ...taskData})
        //02
        setVisibleEditor(true);
    }

    return (
        <div className="center_container">
            <Navbar />
            <div className="main_center_content_wrapper">
                <div className="main_outer_content">
                    <div className="main_outer_heading">Search</div>
                </div>

                <div className="main_center_content">
                    <SearchResults type = {"extReviews"} title = {"Other universities"} select = {selectTask} />
                    <SearchResults type = {"intReviews"} title = {"My university"} select = {selectTask} />
                    { visibleEditor && <Editor taskData = {selectedTask} close = {() => setVisibleEditor(false)}/> }
                </div>

                <div className="main_outer_content right_bound_outer_content"></div>
            </div>
        </div>
    );
};

export default Search;

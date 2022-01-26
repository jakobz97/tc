import React, {useState, useRef, useEffect} from "react";

import {selectIsLoggedIn, selectUserType} from "../../../slice/authSlice";
import {getUserAsync, removeUserAsync, selectUserList} from "../../../slice/adminSlice";

import { useDispatch, useSelector } from "react-redux";
import {history} from "../../../helpers/history";

import Navbar from "../../general/navbar/Navbar";
import UserListItem from "../../admin/manage/UserListItem";

import '../../../styles/shared/main.css';
import '../../../styles/main/admin/manage/ManageUser.css';

const ManageUser = () => {

    const userList = useSelector(selectUserList)
    const loggedIn = useSelector(selectIsLoggedIn)
    const userType = useSelector(selectUserType)

    if (!loggedIn || userType !== 'admin') {
        history.push("/login");
        window.location.reload();
    }

    const dispatch = useDispatch();

    // ======================================

    /**
     * @function (01) on load of component load all users of this hospital
     *           (02) hide loading sign
     */
    useEffect(() => {
        //01
        dispatch(getUserAsync())
            .then((res) => {
                //02
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    /**
     * @function (01) dispatch the delete user function
     * @param userId is the specific id of the user
     */
    const removeUser = (userId) => {
        //01
        dispatch(removeUserAsync({userId: userId}))
            .then((res) => {
                console.log('success', res)
            })
            .catch((err) => {
                console.log('err', err)
            })
    }

    // ======================================

    return (
        <div className="center_container">
            <Navbar />
            <div className="main_center_content_wrapper">
                <div className="main_outer_content">
                    <div className="main_outer_heading">Manage users</div>
                </div>
                <div className="main_center_content start_main_center_content">
                    <div className="user_header">
                        <div className="user_header_section small_user_header_section">Type</div>
                        <div className="user_header_section">Signup Date</div>
                        <div className="user_header_section">Name</div>
                        <div className="user_header_section">E-Mail</div>
                        <div className="user_header_section small_user_header_section">Delete</div>
                    </div>

                    <div className="user_table">
                        { userList.length > 0 ? userList.map((user, i) => <UserListItem user= {user} deleteUser = {removeUser} />) : <div className="admin_user_empty">No users found - Invite other users</div>}
                    </div>
                </div>
                <div className="main_outer_content"></div>
            </div>
        </div>
    );
};

export default ManageUser;

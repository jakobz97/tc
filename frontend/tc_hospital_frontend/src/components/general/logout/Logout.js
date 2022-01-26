import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";

import {logoutAsync} from "../../../slice/authSlice";

import '../../../styles/main/general/logout/logout.css';
import {history} from "../../../helpers/history";



const Logout = () => {

    const dispatch = useDispatch();

    /**
     * @function (01) dispatch the logout to the backend
     *           (02) on success redirect to the landing page again
     */
    useEffect(() => {
        //01
        dispatch(logoutAsync())
            .then((res) => {
                //02
                history.push("/");
                window.location.reload();
            })
            .catch((err) => {
                console.log('err', err)
            })
    }, [])

    return (
        <div className="logout_container">
            You are safely being logged out...
        </div>
    );
};

export default Logout;

import React from "react";

import {selectIsLoggedIn, selectUserType} from "../../../slice/authSlice";
import {inviteUserAsync} from "../../../slice/adminSlice";

import { useDispatch, useSelector } from "react-redux";
import {history} from "../../../helpers/history";

import Navbar from "../../general/navbar/Navbar";

import '../../../styles/shared/main.css';
import '../../../styles/main/admin/invite/InviteUser.css';

const InviteUser = () => {

    const loggedIn = useSelector(selectIsLoggedIn)
    const userType = useSelector(selectUserType)

    if (!loggedIn || userType !== 'admin') {
        history.push("/login");
        window.location.reload();
    }

    const dispatch = useDispatch();

    // ======================================

    /**
     * @function (01) prevent the default of the form behaviour
     *           (02) dispatch the user invite data - convert form data to object
     *           (03) clear the form and indicate success
     *           (04) todo reload all active links
     */
    const inviteUser = (e) => {
        //01
        e.preventDefault();
        //02
        dispatch(inviteUserAsync(Object.fromEntries(new FormData(e.target))))
        //03
        e.currentTarget.reset();
    }

    // ======================================

    return (
        <div className="center_container">
            <Navbar />
                <div className="main_center_content_wrapper">
                    <div className="main_outer_content">
                        <div className="main_outer_heading">Invite users</div>
                    </div>
                    <div className="main_center_content">
                        <form className="invite_section" onSubmit={inviteUser}>
                            <input className="create_input_invite_admin" placeholder="E-Mail" name="email" type="email" required/>
                            <input className="radio_create" id="student_radio" type="radio" name="user_type" value="student" required/>
                            <label className="radio_label" htmlFor="student_radio">Student</label>
                            <input className="radio_create" id="coder_radio" type="radio" name="user_type" value="coder" required/>
                            <label className="radio_label" htmlFor="coder_radio">Coder</label>
                            <div className="horizontal_divider"></div>
                            <button className="create_submit_invite_admin" type="submit">Send</button>
                        </form>
                    </div>
                    <div className="main_outer_content"></div>
                </div>
        </div>
    );
};

export default InviteUser;

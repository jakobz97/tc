import React, { useState, useEffect } from "react";
import {validateLinksAsync, submitUserAsync} from "../../../slice/verifySlice"

import { useDispatch, useSelector } from "react-redux";
import {history} from "../../../helpers/history";

import '../../../styles/main/general/verify/verify.css'

const Verify = ({ match }) => {

    const [inviteData, setInviteData] = useState({})

    const dispatch = useDispatch();

    /**
     * @function (00) remove all tokens
     *           (01) verify the signup link backend side
     */
    useEffect(() => {
        //00
        localStorage.removeItem("user");
        localStorage.removeItem("userType");
        localStorage.setItem("loggedIn", "false");

        //01
        dispatch(validateLinksAsync(match.params.hash))
            .then((res) => {
                setInviteData(prevState => ({...prevState, ...res.payload.inviteData}))
            })
            .catch((e) => {
                console.log('error', e)
            })

        console.log()
    }, [])


    /**
     * @function (01) prevent the default form submit
     *           (02) dispatch the form result to proceed data in the backend
     *           (03) redirect user based on type to the appropriate home page
     */
    const signup = (e) => {
        //01
        e.preventDefault();
        //02
        let signupData = {...{hash: match.params.hash, inviteId: inviteData._id}, ...Object.fromEntries(new FormData(e.target))}
        dispatch(submitUserAsync(signupData))
            .then((res) => {
                //03
                res.payload.userType === 'student' ? history.push("/student/search/") : history.push("/coder/editor/")
                window.location.reload();

                //todo redirect to the right page
                //todo update user type in auth slice
            })
            .catch((e) => {
                console.log('error', e)
            })


    }


    return (

        <div className="main_wrapper">
            <div className="top_section">
                <div className="heading_text"></div>
            </div>

            <div className="main_verify_section">
                <form className="main_sub_large" onSubmit={signup}>
                    <div className="input_wrapper">
                        <div className="input_section">
                            <div className="input_desc" id="psw_input">E-Mail wiederholen</div>
                            <input className="input_field" type="text" name="email" required/>
                        </div>
                        <div className="input_section">
                            <div className="input_desc" id="psw_input">Passwort vergeben</div>
                            <input className="input_field" id="psw_input" type="password" name="password" required/>
                        </div>
                        <div className="input_section">
                            <button type="submit" className="submit_btn" id="submit_button">Registrieren</button>
                        </div>
                    </div>
                </form>
                <div className="main_sub_small">{inviteData.userType === 'student' ? "Student Account" : "Coder Account"}</div>
            </div>

            <div className="bottom_section"></div>
        </div>


    );
};

export default Verify;

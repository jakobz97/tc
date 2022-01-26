import React, { useState } from "react";
import {Link} from 'react-router-dom';
import {selectIsLoggedIn} from "../../../slice/authSlice";

import SignUp from './Signup';

import "../../../styles/main/general/landing/LandingPage.css";

const LandingPage = () => {

    return (
        <div className="landing_wrapper">
            <div id="navbar">
                <div id="logo_wrapper">
                    {/*ICD 10 Coder*/}
                </div>
                <div id="right_navbar">
                    <a class="navbar_link">How it works</a>
                    <a class="navbar_link">Team</a>
                    <a class="navbar_link">Contact</a>
                    <Link to={"/login"} id="login" class="navbar_link active_link">Log in</Link>
                </div>
            </div>

            <div id="main">
                <div className="main_section">
                    {/*
                    <p id="main_txt">Spielerisch ihren Umsatz steigern</p>
                    <p id="main_sub_text">Durch die Zusammenarbeit von angehenden Ärzten und Krankenhäusern wirklich alle ICD Codes erfassen und so das Geld erhalten, welches Ihrem Krankenhaus zusteht.</p>
                    */}
                    <p id="main_txt">Maximise revenues with gamification</p>
                    <p id="main_sub_text">By getting trainee doctors and hospitals to work together, capture all the ICD codes and get the money your hospital deserves.</p>
                </div>
                <SignUp />
            </div>
        </div>

    );
};

export default LandingPage;

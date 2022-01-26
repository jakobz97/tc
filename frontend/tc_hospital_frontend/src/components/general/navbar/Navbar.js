import React, {useState, useRef, useEffect} from "react";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {selectUserType} from "../../../slice/authSlice";

import Tooltip from "./Tooltip";

import '../../../styles/main/general/navbar/Navbar.css';

import add from '../../../assets/nav/add_user.svg';
import logout from '../../../assets/nav/logout.svg';
import analytics from '../../../assets/nav/analytics.svg';
import upload from '../../../assets/nav/upload.svg';
import search from '../../../assets/nav/search.svg';
import edit from '../../../assets/nav/edit.svg';

const Navbar = () => {

    const userType = useSelector(selectUserType)


    /**
     * @function (01) on render of the component get the current path depending on the path add the active UI class
     */
    useEffect(() => {
        //01
        //document.getElementById(`${window.location.pathname.substring(1)}_nav_item`).classList.add('active_nav_item');
    }, []);

    /**
     * @function (01) get the currently highlighted nav button and remove the highlight
     *           (02) add the highlight to the clicked button
     * @param id of the element where the class is added to
     */
    const changeHighlight = (id) => {
        //01
        //document.getElementsByClassName('active_nav_item')[0].classList.remove('active_nav_item')
        //02
        //document.getElementById(id).classList.add('active_nav_item');
    }

    return (
        <div className="nav_bar">

            <div className="outer_nav_bar">
                <div className="nav_item">
                    {/*<img src={logo} className="nav_icon large_nav_icon" />*/}
                </div>
            </div>

            {
                userType === 'admin' ? (
                    <div className="center_nav_bar">
                        <Link to={"/admin/invite/"} id="order_nav_item" className="nav_item" onClick={() => changeHighlight('orders_nav_item')}>
                            <Tooltip content="Invite" direction="right">
                                <img src={add} className="nav_icon" />
                            </Tooltip>
                        </Link>
                        <Link to={"/admin/users/"} id="order_nav_item" className="nav_item" onClick={() => changeHighlight('orders_nav_item')}>
                            <Tooltip content="User management" direction="right">
                                <img src={edit} className="nav_icon" />
                            </Tooltip>
                        </Link>
                    </div>
                ) : userType === 'coder' ? (
                    <div className="center_nav_bar">
                        <div className="center_nav_bar">
                            <Link to={"/coder/editor/"} id="order_nav_item" className="nav_item" onClick={() => changeHighlight('orders_nav_item')}>
                                <Tooltip content="Upload document" direction="right">
                                    <img src={upload} className="nav_icon" />
                                </Tooltip>
                            </Link>
                            <Link to={"/coder/reviews/"} id="income_nav_item" className="nav_item" onClick={() => changeHighlight('income_nav_item')}>
                                <Tooltip content="Reviews" direction="right">
                                    <img src={analytics} className="nav_icon" />
                                </Tooltip>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="center_nav_bar">
                        <div className="center_nav_bar">
                            <div className="center_nav_bar">
                                <Link to={"/student/search/"} id="order_nav_item" className="nav_item" onClick={() => changeHighlight('orders_nav_item')}>
                                    <Tooltip content="Suche" direction="right">
                                        <img src={search} className="nav_icon" />
                                    </Tooltip>
                                </Link>
                                <Link to={"/student/analytics/"} id="income_nav_item" className="nav_item" onClick={() => changeHighlight('income_nav_item')}>
                                    <Tooltip content="Analytics" direction="right">
                                        <img src={analytics} className="nav_icon" />
                                    </Tooltip>
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            }

            <div className="outer_nav_bar">
                <Link to={"/logout"} id="logout_nav_item" className="nav_item" onClick={() => changeHighlight('logout_nav_item')}>
                    <Tooltip content="Logout" direction="right">
                        <img src={logout} className="nav_icon" />
                    </Tooltip>
                </Link>
            </div>

        </div>

    );
};

export default Navbar;

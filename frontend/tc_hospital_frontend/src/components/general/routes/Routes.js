import React, {useEffect} from "react";
import { useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";

//General routes
import LandingPage from "../landing/LandingPage";
import Login from "../login/Login";
import Verify from "../verify/Verify";
import Logout from "../logout/Logout";

//Admin only routes
import AdminUsers from "../../admin/manage/ManageUser";
import AdminInvite from "../../admin/invite/InviteUser";

//Student routes
import StudentEditor from "../../student/editor/Editor";
import StudentSearch from "../../student/search/Search";
import StudentAnalytics from "../../student/analytics/Analytics";

//Coder routes
import CoderEditor from "../../coder/editor/Editor";
import CoderReviews from "../../coder/reviews/Reviews";


import { history } from "../../../helpers/history";
import {selectIsLoggedIn, selectUserType} from "../../../slice/authSlice";


function Routes() {
    /**
     * @desc (01) check from redux if the user is logged in
     *       (02) if user is logged in redirect to the specific user type
     */
    const loggedIn = useSelector(selectIsLoggedIn);
    const userType = useSelector(selectUserType);

    /**
     * @desc return the available routes based on the current user status - logged in or not logged in
     */
    return (
        <>
            {loggedIn && userType === 'admin' ? (
                <Switch>
                    <Route exact path="/" component={LandingPage} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/logout" component={Logout} />
                    <Route exact path="/verify/:hash" component={Verify} />

                    <Route exact path="/admin/invite/" component={AdminInvite} />
                    <Route exact path="/admin/users/" component={AdminUsers} />
                </Switch>
            ) : loggedIn && userType === 'coder' ? (
                <Switch>
                    <Route exact path="/" component={LandingPage} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/logout" component={Logout} />
                    <Route exact path="/verify/:hash" component={Verify} />

                    <Route exact path="/coder/editor/" component={CoderEditor} />
                    <Route exact path="/coder/reviews/" component={CoderReviews} />
                </Switch>
            ) : loggedIn && userType === 'student' ? (
                <Switch>
                    <Route exact path="/" component={LandingPage} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/logout" component={Logout} />
                    <Route exact path="/verify/:hash" component={Verify} />

                    <Route exact path="/student/editor/" component={StudentEditor} />
                    <Route exact path="/student/search/" component={StudentSearch} />
                    <Route exact path="/student/analytics/:id" component={StudentAnalytics} />
                    <Route exact path="/student/analytics/" component={StudentAnalytics} />
                </Switch>
            ) : (
                <Switch>
                    <Route exact path="/" component={LandingPage} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/verify/:hash" component={Verify} />
                </Switch>
            )}
        </>
    );
}

export default Routes;

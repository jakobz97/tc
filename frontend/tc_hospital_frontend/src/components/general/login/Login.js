import React, {useState} from "react";
import {Link} from 'react-router-dom';
import {loginAsync} from "../../../slice/authSlice";

import { useDispatch, useSelector } from "react-redux";

import { history } from "../../../helpers/history";

import '../../../styles/main/general/login/Login.css';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [forgotPsw, setForgotPsw] = useState(false);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    /**
     * @function (01) prevent the default form behaviour and set to loading
     *           (02) dispatch the login
     *           (03) redirect based on user type
     */
    const performLogin = (e) => {
        //01
        e.preventDefault();
        setLoading(true);
        //02
        dispatch(loginAsync({email: email, password: password}))
            .then((res) => {
                //03
                res.payload.userType === 'student' ? history.push("/student/search/") : res.payload.userType === 'coder' ? history.push("/coder/editor/") : history.push("/admin/invite/")
                window.location.reload();
            })
            .catch((err) => {
                setLoading(false);
            });
    };

    /**
     * @function (01)
     */
    const performForgotPsw = (e) => {

    }

    //if (isLoggedIn) return <Redirect to="/profile" />;

    return (
        <div className="login_wrapper">
            <div className="login_section">
                <div className="outer_login_wrapper">
                    {/*Welcome*/}
                </div>
                {!forgotPsw ? (
                    <form className="login_field_wrapper" onSubmit={performLogin}>
                        <input name="email" className="login_input" placeholder="E-Mail" type="email" required onChange={(e) => setEmail(e.target.value)}/>
                        <input name="password" className="login_input" placeholder="Password" type="password" required onChange={(e) => setPassword(e.target.value)}/>
                        <button className="login_btn" type="submit">
                            {loading ? (<span>Processing</span>) : (<span>Login</span>)}
                        </button>
                        <div className="login_btn forgot_btn" onClick={() => {setForgotPsw(true)}}>Passwort vergessen</div>
                        <div className="signup_txt_btn">Noch keinen Account - <Link className="signup_txt_link" to={"/"}>erstellen Sie noch heute einen</Link></div>
                    </form>
                ) : (
                    <form className="login_field_wrapper" onSubmit={performForgotPsw}>
                        <input name="email" className="login_input" placeholder="E-Mail" type="email" required onChange={(e) => setEmail(e.target.value)}/>
                        <button className="login_btn" type="submit">
                            {loading ? (<span>Processing</span>) : (<span>Passwort wiederherstellen</span>)}
                        </button>
                        <div className="login_btn forgot_btn" onClick={() => {setForgotPsw(false)}}>Zurück</div>
                    </form>
                )}
                <div className="outer_login_wrapper">
                    <div className="login_legal"><Link className="signup_txt_link" to={"/"}>Impressum</Link>  |  <Link className="signup_txt_link" to={"/"}>Datenschutz</Link>  |  <Link className="signup_txt_link" to={"/"}>AGB</Link>  |  <Link className="signup_txt_link" to={"/"}>Kontakt</Link></div>
                </div>
            </div>
            <div className="login_section">
                Log In
            </div>
        </div>
    );
};

export default Login;

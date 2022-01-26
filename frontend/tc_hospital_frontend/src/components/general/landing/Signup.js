import React, {useEffect, useState, CSSProperties} from "react";
import { Redirect } from 'react-router-dom';
import Select from 'react-select';

import {signUpAsync} from "../../../slice/authSlice";
import { useDispatch, useSelector } from "react-redux";

import { history } from "../../../helpers/history";

import "../../../styles/main/general/landing/Signup.css";

const Signup = () => {

    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const dispatch = useDispatch();


    /**
     * @function (01) prevent the default and update to loading state
     *           (02) check if hospital option was selected - if not return
     *           (03) merge with the form object
     *           (02) dispatch to the signup reducer and wait until fulfilled
     */
    const performSignup = (e) => {
        //01
        e.preventDefault();
        setLoading(true);
        //02
        if (!selectedOption) return alert('please select a hospital')
        //03
        let signupData = {...Object.fromEntries(new FormData(e.target)), ...{hospitalCode: selectedOption.value, hospitalName: selectedOption.label}}
        //02
        dispatch(signUpAsync(signupData))
            .then((res) => {
                history.push("/admin/invite/");
                window.location.reload();
            })
            .catch((err) => {
                console.log(err)
                setLoading(false);
            });
    };

    // =================================

    const options = [
        { value: '00001', label: 'DONAUISAR Klinikum Deggendorf-Dingolfing-Landau' },
        { value: '00003', label: 'Klinikum Bremen links der Weser' }
    ];

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            borderBottom: '2px dotted green',
            color: state.isSelected ? 'yellow' : 'black',
            backgroundColor: state.isSelected ? 'green' : 'white',
            width: '100%',
            height: "200%"
        }),
        control: (provided) => ({
            ...provided,
            margin: "4% 0 4% 0",
            width: "34vw",
            borderRadius: "8px",
            height: "8vh",
            backgroundColor: "white",
            padding: "0 2.5% 0 2.5%",
            fontSize: "1em",
            color: '#505DF7',
            textAlign: 'center',
            border: 'none'
        }),
        placeholder: (defaultStyles) => ({
            ...defaultStyles,
            fontSize: '1em',
            color: '#505DF7',
            textAlign: 'center'
        })
    }

    // =================================

    return (
        <div className="main_section right_main_section">
            <div id="cta_wrapper">
                <form className="su_section" onSubmit={performSignup}>
                    <input className="signup_input short_input" name="firstName" placeholder="First name" type="text" required />
                    <input className="signup_input short_input" name="lastName" placeholder="Last name" type="text" required />
                    <Select
                        placeholder="Choose hospital ..."
                        styles = { customStyles }
                        options = { options }
                        onChange = { setSelectedOption }
                    />
                    <input className="signup_input short_input" name="email" placeholder="E-Mail" type="email" required />
                    <input className="signup_input short_input" name="password" placeholder="Password" type="password" required/>
                    <button type="submit" className="signup_input signup_btn">
                        {loading ? ("Processing ...") : ("Signup")}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;

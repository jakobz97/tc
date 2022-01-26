import React, {useEffect} from "react";

import '../../../styles/shared/fadein.css';

const UploadFadeIn = ({ submit, close}) => {

    /**
     * @function (01) get the dark background, the content wrapper and the inputs
     *           (02) increase the dark background opacity
     *           (03) fade up the content wrapper with an animation and set focus on the input
     */
    useEffect(() => {
        //01
        let bg = document.querySelector('.menu_dark_bg'),
            content = document.querySelector('.create_input_wrapper'),
            input = document.querySelector('.create_input');
        //02
        bg.style.cssText = "opacity: 100%";
        //03
        content.style.marginTop = "0";
        setTimeout(() => {
            input.focus()
        }, 350)
    }, [])

    /**
     * @function (01) get the background and content
     *           (02) return if user clicked on the content
     *           (03) user clicked outside of content - hide
     *           (04) after timeout set state again to hidden
     */
    const hideCreateView = (e, forced) => {
        //01
        let bg = document.querySelector('.menu_dark_bg'),
            content = document.querySelector('.create_input_wrapper');
        //02
        if (!forced && content.contains(e.target)) return;
        //03
        bg.style.cssText = "opacity: 0%";
        content.style.marginTop = "150vh";
        //04
        setTimeout(() => close(), 350)
    };

    return (
        <div className="menu_dark_bg" onClick={hideCreateView}>
            <form className="create_input_wrapper" onSubmit={submit}>
                <div className="create_input_hide" onClick={(e) => {hideCreateView(e, true)}}>X</div>

                <input name="title" className="create_input" type="text" placeholder="Titel" required />
                <div className="create_btn_wrapper">
                    <input id="easy_button" value="easy" name="difficulty" className="create_input_radio" type="radio" defaultChecked />
                    <label className="create_btn_label" htmlFor="easy_button">Easy</label>
                    <input id="medium_button" value="medium" name="difficulty" className="create_input_radio" type="radio" />
                    <label className="create_btn_label" htmlFor="medium_button">Medium</label>
                    <input id="hard_button" value="hard" name="difficulty" className="create_input_radio" type="radio" />
                    <label className="create_btn_label" htmlFor="hard_button">Difficult</label>
                </div>
                <div className="create_btn_wrapper">
                    <input id="internal_button" value="true" name="internalOnly" className="create_input_radio" type="radio" defaultChecked />
                    <label className="create_btn_label create_btn_label_ext" htmlFor="internal_button">Only for our students</label>
                    <input id="external_button" value="false" name="internalOnly" className="create_input_radio" type="radio" />
                    <label className="create_btn_label create_btn_label_ext" htmlFor="external_button">For all</label>
                </div>

                <button className="create_submit">Upload</button>
            </form>
        </div>
    );
};

export default UploadFadeIn;

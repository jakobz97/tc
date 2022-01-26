import axios from "axios";


export const validateInviteLink = (hash) => {
    return axios
        .get('https://gateway.icdcoder.de/invite/validate/'+hash)
        .then((response) => {
            return response.data;
        })
        .catch((e) => {
            console.log('error', e)
        })
};

export const submitInvite = (inviteData) => {
    return axios
        .post('https://gateway.icdcoder.de/invite/submit/', inviteData)
        .then((response) => {
            if (response.data.tokenData.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data.tokenData));
                localStorage.setItem("userType", response.data.userType);
                localStorage.setItem("loggedIn", "true");
            }
            return response.data;
        })
        .catch((e) => {
            console.log('error', e)
        })
};

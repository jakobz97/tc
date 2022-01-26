import axios from "axios";
import auth_header from "./auth_header";

export const signup = (signupData) => {
    return axios
        .post('https://gateway.icdcoder.de/admin/', signupData)
        .then((response) => {
            if (response.data.tokenData.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data.tokenData));
                localStorage.setItem("userType", response.data.userType);
                localStorage.setItem("loggedIn", "true");
            }
            return response.data;
        });
};

export const login = (credentials) => {
    return axios
        .post('https://gateway.icdcoder.de/auth/', credentials)
        .then((response) => {
            if (response.data.tokenData.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data.tokenData));
                localStorage.setItem("userType", response.data.userType);
                localStorage.setItem("loggedIn", "true");
            }
            return response.data;
        })
        .catch((e) => {
            alert('wrong creds')
            console.log(e)
        })
};

export const logout = () => {
  return axios
      .post('https://gateway.icdcoder.de/logout/', {}, { headers: auth_header() })
      .then((response) => {
          localStorage.removeItem("user");
          localStorage.removeItem("userType");
          localStorage.setItem("loggedIn", "false");
          return response.data;
      });
};

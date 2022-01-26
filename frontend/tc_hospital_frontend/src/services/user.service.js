import axios from "axios";
import auth_header from "./auth_header";

export const userData = async () => {
    return axios
        .get('https://gateway.icdcoder.de/user/', { headers: await auth_header() })
        .then((response) => {
            return response.data;
        });
};

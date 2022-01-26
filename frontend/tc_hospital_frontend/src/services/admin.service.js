import axios from "axios";
import auth_header from "./auth_header";

export const activeLinks = async () => {
  return axios
      .get('https://gateway.icdcoder.de/admin/invite/',{ headers: await auth_header() })
      .then((response) => {
        return response.data;
      });
};

export const getUsers = async () => {
    return axios
        .get('https://gateway.icdcoder.de/admin/users/',{ headers: await auth_header() })
        .then((response) => {
            return response.data;
        });
};

export const removeUser = async (userId) => {
    return axios
        .post('https://gateway.icdcoder.de/admin/remove/users/', userId,{ headers: await auth_header() })
        .then((response) => {
            return response.data;
        });
};

export const inviteUser = async (inviteData) => {
  return axios
      .post('https://gateway.icdcoder.de/admin/invite/', inviteData, { headers: await auth_header() })
      .then((response) => {
          return response.data;
      });
};

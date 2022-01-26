import axios from "axios";
import auth_header from "./auth_header";

export const codeCompletion = async (data) => {
    return axios
        .post('https://gateway.icdcoder.de/code/', data, { headers: await auth_header() })
        .then((response) => {
            return response.data;
        });
};

export const uploadCode = async (data) => {
    return axios
        .post('https://gateway.icdcoder.de/coder/upload/', data, { headers: await auth_header() })
        .then((response) => {
            return response.data;
        });
};

export const uploadStudentCode = async (data) => {
    return axios
        .post('https://gateway.icdcoder.de/student/upload/', data, { headers: await auth_header() })
        .then((response) => {
            return response.data;
        });
};

export const getCreatedUploads = async () => {
    return axios
        .get('https://gateway.icdcoder.de/coder/upload/', { headers: await auth_header() })
        .then((response) => {
            return response.data;
        });
};

export const getSuitableUploads = async (searchOffset) => {
    return axios
        .post('https://gateway.icdcoder.de/student/tasks/', searchOffset, { headers: await auth_header() })
        .then((response) => {
            return response.data;
        });
};

export const getAnalyticsUploads = async (reviewIds) => {
    return axios
        .post('https://gateway.icdcoder.de/student/analytics/', reviewIds, { headers: await auth_header() })
        .then((response) => {
            return response.data;
        });
};

export const proposeCode = async (code) => {
    return axios
        .post('https://gateway.icdcoder.de/student/proposal/', code, {headers: await auth_header()})
        .then((response) => {
            return response.data;
        });
}

export const getProposal = async (reviewId) => {
    return axios
        .post('https://gateway.icdcoder.de/coder/proposal/', reviewId, {headers: await auth_header()})
        .then((response) => {
            return response.data;
        });
}

export const modifyProposal = async (proposalData) => {
    return axios
        .post('https://gateway.icdcoder.de/coder/proposal/edit/', proposalData, {headers: await auth_header()})
        .then((response) => {
            return response.data;
        });
}

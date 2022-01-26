import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    codeCompletion,
    getAnalyticsUploads,
    //compareCodes,
    getCreatedUploads, getProposal,
    getSuitableUploads, modifyProposal, proposeCode,
    uploadCode, uploadStudentCode
} from '../services/review.service';

const initialState = {
    createdUploads: [],
    suitableUploads: {}
};

export const codeCompletionAsync = createAsyncThunk(
    'review/codeCompletion',
    async (data) => {
        return await codeCompletion(data);
    }
);

export const uploadCodeAsync = createAsyncThunk(
    'review/uploadCode',
    async (data) => {
        return await uploadCode(data);
    }
);

export const uploadStudentCodeAsync = createAsyncThunk(
    'review/uploadStudentCode',
    async (data) => {
        const response = await uploadStudentCode(data);
        return response;
    }
);

export const getUploadsAsync = createAsyncThunk(
    'review/getUploads',
    async () => {
        return await getCreatedUploads();
    }
);

export const getSuitableUploadsAsync = createAsyncThunk(
    'review/getSuitableUploads',
    async (searchOffset) => {
        const response = await getSuitableUploads(searchOffset);
        return response;
    }
);

export const getReviewAnalyticsAsync = createAsyncThunk(
    'review/analyseReviews',
    async (reviewIds) => {
        return await getAnalyticsUploads(reviewIds);
    }
);

export const proposeCodeAsync = createAsyncThunk(
    'review/proposeCode',
    async (code) => {
        return await proposeCode(code);
    }
);

export const getProposalsAsync = createAsyncThunk(
    'review/getProposal',
    async (reviewId) => {
        return await getProposal(reviewId);
    }
);

export const modifyProposalsAsync = createAsyncThunk(
    'review/modifyProposal',
    async (proposalData) => {
        return await modifyProposal(proposalData);
    }
);

export const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(codeCompletionAsync.fulfilled, (state, action) => {
                //todo add to redux
            })
            .addCase(uploadCodeAsync.fulfilled, (state, action) => {
                //todo add to redux
            })
            .addCase(getUploadsAsync.fulfilled, (state, action) => {
                state.createdUploads = action.payload.codes.sort((a, b) => b.proposalCounter-a.proposalCounter);
            })
            .addCase(getSuitableUploadsAsync.fulfilled, (state, action) => {
                state.suitableUploads = {...state.suitableUploads, ...action.payload}
            })
            .addCase(uploadStudentCodeAsync.fulfilled, (state, action) => {
                console.log('uploaded student code')
            })
            .addCase(getReviewAnalyticsAsync.fulfilled, (state, action) => {
                console.log('analytics ')
            })
            .addCase(proposeCodeAsync.fulfilled, (state, action) => {
                console.log('proposed code')
            })
    },
});

export const {} = reviewSlice.actions;

export const selectCreatedUploads = (state) => state.review.createdUploads;
export const selectSuitableUploads = (state) => state.review.suitableUploads;

export default reviewSlice.reducer;

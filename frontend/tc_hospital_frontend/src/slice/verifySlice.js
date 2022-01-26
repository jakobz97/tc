import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { validateInviteLink, submitInvite } from '../services/verify.service';

const initialState = {
};

export const validateLinksAsync = createAsyncThunk(
    'invite/validate',
    async (hash) => {
        const response = await validateInviteLink(hash);
        return response;
    }
);

export const submitUserAsync = createAsyncThunk(
    'invite/submit',
    async (userData) => {
        return await submitInvite(userData);
    }
);

export const verifySlice = createSlice({
    name: 'verify',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(validateLinksAsync.fulfilled, (state, action) => {
                console.log(action.payload)
            })
            .addCase(submitUserAsync.fulfilled, (state, action) => {
            })
    },
});

export const {} = verifySlice.actions;

export default verifySlice.reducer;

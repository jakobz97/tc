import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userData } from '../services/user.service';

const initialState = {
    userData: {}
};

export const getUserAsync = createAsyncThunk(
    'user/data',
    async (credentials) => {
        return await userData(credentials);
    }
);

//todo edit user and so on

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserAsync.fulfilled, (state, action) => {
                return {userData: action.payload.userData}
            })
    },
});

export const { setUserData } = userSlice.actions;

export const selectUserData = (state) => state.user.userData;

export default userSlice.reducer;

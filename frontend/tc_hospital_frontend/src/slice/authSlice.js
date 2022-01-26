import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {login, logout, signup} from '../services/auth.service';

const initialState = {
    loggedIn: localStorage.getItem("loggedIn") === 'true',
    userType: localStorage.getItem("userType"),
};

export const loginAsync = createAsyncThunk(
    'auth/login',
    async (credentials) => {
        return await login(credentials);
    }
);

export const signUpAsync = createAsyncThunk(
    'auth/signup',
    async (signupData) => {
        return await signup(signupData);
    }
);

export const logoutAsync = createAsyncThunk(
    'auth/logout',
    async () => {
        return await logout();
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.fulfilled, (state, action) => {
                console.log('logged in')
            })
            .addCase(signUpAsync.fulfilled, (state, action) => {
                console.log('signed up')
            })
            .addCase(logoutAsync.fulfilled, (state, action) => {
                console.log('loaded logout');
            });
    },
});

export const selectIsLoggedIn = (state) => state.auth.loggedIn;
export const selectUserType = (state) => state.auth.userType;

export default authSlice.reducer;

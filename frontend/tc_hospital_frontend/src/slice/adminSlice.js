import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {activeLinks, getUsers, inviteUser, removeUser} from '../services/admin.service';

const initialState = {
    activeLinks: [],
    userList: []
};

export const currentLinksAsync = createAsyncThunk(
    'admin/fetchActiveLinks',
    async () => {
        return await activeLinks();
    }
);

export const getUserAsync = createAsyncThunk(
    'admin/getUserList',
    async () => {
        return await getUsers();
    }
);

export const removeUserAsync = createAsyncThunk(
    'admin/removeUser',
    async (userId) => {
        return await removeUser(userId);
    }
);

export const inviteUserAsync = createAsyncThunk(
    'admin/invite',
    async (userData) => {
        return await inviteUser(userData);
    }
);

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(currentLinksAsync.fulfilled, (state, action) => {
                console.log('loaded current orders')
                state.currentOrders = action.payload;
            })
            .addCase(getUserAsync.fulfilled, (state, action) => {
                let filteredUserList = action.payload.userList.filter((user) => user._id !== action.payload.userId);
                return {...state, userList: filteredUserList}
            })
            .addCase(removeUserAsync.fulfilled, (state, action) => {
                let updatedUserList = state.userList.filter((user) => user._id !== action.payload.userId);
                return { ...state, userList: updatedUserList }
            })
            .addCase(inviteUserAsync.fulfilled, (state, action) => {
                console.log('loaded past orders')
                state.pastOrders = action.payload;
            })
    },
});

export const {} = adminSlice.actions;

export const selectActiveLinks = (state) => state.admin.activeLinks;
export const selectUserList = (state) => state.admin.userList;

export default adminSlice.reducer;

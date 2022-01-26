import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slice/authSlice';
import adminReducer from '../slice/adminSlice';
import userReducer from '../slice/userSlice';
import verifyReducer from '../slice/verifySlice';
import reviewReducer from '../slice/reviewSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    verify: verifyReducer,
    review: reviewReducer,
    user: userReducer
  },
});

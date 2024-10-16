// store.js
import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from './bookingSlice';

import authSlice from "./authSlice"

const store = configureStore({
  reducer: {
    booking: bookingReducer,  // You can add more slices here if needed
    authentication : authSlice
  },
});

export default store;

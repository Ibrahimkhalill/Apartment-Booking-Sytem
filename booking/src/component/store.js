// store.js
import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from './bookingSlice';
import apiSlice from './../component/admin/apiSlice'; // Ensure the import path is correct
import authSlice from './authSlice'; // Make sure this is the correct import

const store = configureStore({
  reducer: {
    booking: bookingReducer, // Booking slice for managing booking state
    authentication: authSlice, // Auth slice for managing authentication state
    [apiSlice.reducerPath]: apiSlice.reducer, // Correctly use apiSlice.reducer
  },
  // Optional: Add middleware if needed, like logging or custom middleware
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(apiSlice.middleware), // Correctly use apiSlice.middleware
});

export default store;

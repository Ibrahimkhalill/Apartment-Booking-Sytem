// selectors.js
import { createSelector } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

export const selectCheckInDate = (state) => state.booking.checkInDate;
export const selectCheckOutDate = (state) => state.booking.checkOutDate;

export const memoizedCheckInDate = createSelector(
  [selectCheckInDate],
  (checkInDate) => dayjs(checkInDate)
);

export const memoizedCheckOutDate = createSelector(
  [selectCheckOutDate],
  (checkOutDate) => dayjs(checkOutDate)
);

import { createSlice } from '@reduxjs/toolkit';
import dayjs from "dayjs";

// Function to get a cookie by name
function getCookie(name) {
  const cookieArr = document.cookie.split(";");
  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split("=");
    const key = cookiePair[0].trim();
    if (key === name) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

// Retrieve the data from cookies (if available)
const checkInDateCookie = getCookie("check_in_date");
const checkOutDateCookie = getCookie("check_out_date");
const roomDataCookie = JSON.parse(getCookie("roomData") || "null"); // Parse back to an object/array

// Set up default initial dates
const today = dayjs();
const tomorrow = dayjs().add(1, "day");

// Initial state for booking slice
const initialState = {
  checkInDate: checkInDateCookie ? dayjs(checkInDateCookie) : today, // Check if cookie exists, otherwise fallback to today
  checkOutDate: checkOutDateCookie ? dayjs(checkOutDateCookie) : tomorrow, // Fallback to tomorrow if no cookie
  rooms: roomDataCookie || [{ id: Date.now(), adults: 1 }], // Fallback to default room
  hasuser: checkInDateCookie ? checkInDateCookie : null
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCheckInDate: (state, action) => {
      state.checkInDate = action.payload;
    },
    setCheckOutDate: (state, action) => {
      state.checkOutDate = action.payload;
    },
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
  },
});

export const { setCheckInDate, setCheckOutDate, setRooms } = bookingSlice.actions;
export default bookingSlice.reducer;

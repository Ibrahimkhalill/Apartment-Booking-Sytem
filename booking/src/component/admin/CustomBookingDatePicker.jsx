import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { MdDateRange } from "react-icons/md";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

import { FaPlus } from "react-icons/fa6";
import { LuHotel } from "react-icons/lu";
import { useSelector, useDispatch } from "react-redux";
import { setCheckInDate, setCheckOutDate, setRooms } from "../bookingSlice";
import { FaRegWindowMinimize } from "react-icons/fa6";

const CustomBookingDatePicker = ({ width }) => {
  const today = dayjs();
  const [showDatePickers, setShowDatePickers] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(today);
  const dropdownRef = useRef(null); //
  const dropdown1Ref = useRef(null); //
  const flagRef = useRef(null);
  const flag1Ref = useRef(null);
  const checkInDate = useSelector((state) => state.booking.checkInDate);
  const checkOutDate = useSelector((state) => state.booking.checkOutDate);
  const hasUser = useSelector((state) => state.booking.hasuser);
  const rooms = useSelector((state) => state.booking.rooms);

  const dispatch = useDispatch();

  const [hasUserSelected, setHasUserSelected] = useState(
    hasUser ? true : false
  );

  const addRoom = () => {
    // Dispatch the updated rooms array using setRooms
    dispatch(
      setRooms([...rooms, { id: Date.now() + rooms.length, adults: 1 }])
    );
  };

  const handleAdultChange = (id, change) => {
    const updatedRooms = rooms.map((room) =>
      room.id === id
        ? { ...room, adults: Math.max(1, room.adults + change) }
        : room
    );

    // Dispatch the updated rooms array using setRooms
    dispatch(setRooms(updatedRooms));
  };

  const removeRoom = (id) => {
    const updatedRooms = rooms.filter((room) => room.id !== id);
    dispatch(setRooms(updatedRooms));
  };
  const [guestCardVisible, setGuestCardVisible] = useState(false);

  const getDaysInMonth = (month, year) => {
    const daysInMonth = [];
    const days = dayjs(`${year}-${month + 1}`).daysInMonth(); // Get days in the current month
    const firstDayOfMonth = dayjs(`${year}-${month + 1}-01`).day(); // Get the day of the week for the first day of the month

    // Fill in empty slots from the previous month
    if (firstDayOfMonth > 0) {
      const prevMonthDays = dayjs(`${year}-${month + 1}`)
        .subtract(1, "month")
        .daysInMonth();
      for (
        let day = prevMonthDays - firstDayOfMonth + 1;
        day <= prevMonthDays;
        day++
      ) {
        daysInMonth.push(dayjs(`${year}-${month}-${day}`)); // Push previous month days
      }
    }

    // Fill in current month days
    for (let day = 1; day <= days; day++) {
      daysInMonth.push(dayjs(`${year}-${month + 1}-${day}`));
    }

    return daysInMonth;
  };

  const currentMonthDays = getDaysInMonth(
    currentMonth.month(),
    currentMonth.year()
  );
  const nextMonthDays = getDaysInMonth(
    currentMonth.add(1, "month").month(),
    currentMonth.add(1, "month").year() // Ensure the year increments correctly
  );

  const handleDateClick = (date) => {
    const todayDate = today.startOf("day"); // Ensure 'today' is at the start of the day (midnight)

    if (date.isBefore(todayDate)) return; // Prevent past date selection

    // Reset selection if the user clicks again after already selecting
    if (checkInDate && checkOutDate) {
      dispatch(setCheckInDate(date));
      // setCheckInDate(date);
      dispatch(setCheckOutDate(null)); // Reset check-out date
      setHasUserSelected(true); // User has made a selection
    } else if (!checkInDate) {
      // If no check-in date is set, set the check-in date
      dispatch(setCheckInDate(date));
      dispatch(setCheckOutDate(null)); // Reset check-out date
      setHasUserSelected(true); // User has made a selection
    } else if (date.isBefore(checkInDate)) {
      // If a check-out date is selected before the check-in date
      dispatch(setCheckInDate(date));
      dispatch(setCheckOutDate(null)); // Reset check-out date
      setHasUserSelected(true); // User has made a selection
    } else if (date.isAfter(checkInDate)) {
      // If the selected date is after the current check-in date
      dispatch(setCheckOutDate(date)); // Update check-out date to selected date
      setHasUserSelected(true); // User has made a selection
    }
  };

  const isInRange = (day) => {
    return (
      checkInDate &&
      checkOutDate &&
      day.isAfter(checkInDate) &&
      day.isBefore(checkOutDate)
    );
  };

  const handleShowDatePickers = () => {
    if (showDatePickers && checkInDate && !checkOutDate) {
      dispatch(setCheckOutDate(checkInDate.add(1, "day")));
      // setCheckOutDate(checkInDate.add(1, "day"));
    }
    setGuestCardVisible(false);
    setShowDatePickers(!showDatePickers);
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the room/guest dropdown when clicking outside
      if (
        dropdown1Ref.current &&
        !dropdown1Ref.current.contains(event.target) &&
        flag1Ref.current &&
        !flag1Ref.current.contains(event.target)
      ) {
        setGuestCardVisible(false);
      }

      // Close the date picker dropdown when clicking outside
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        flagRef.current &&
        !flagRef.current.contains(event.target)
      ) {
        if (showDatePickers && checkInDate && !checkOutDate) {
          setCheckOutDate(checkInDate.add(1, "day"));
        }
        setShowDatePickers(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [checkInDate, checkOutDate, showDatePickers]); // Include relevant dependencies

  const [hoveredDate, setHoveredDate] = useState(null); // New state for hovered date

  // Check if a date is within the hover range
  const isInHoverRange = (day) => {
    // Return false if both check-in and check-out dates are selected
    if (checkInDate && checkOutDate) return false;

    if (!checkInDate || !hoveredDate) return false;

    const hoverDiff = hoveredDate.diff(checkInDate, "day");
    return (
      hoverDiff >= 2 &&
      day.isAfter(checkInDate.subtract(1, "day")) &&
      day.isBefore(hoveredDate.add(1, "day"))
    );
  };
  useEffect(() => {
    // Check if the current viewport width is mobile
    const isMobile = window.innerWidth < 768; // Adjust the value as per your breakpoint
    if (isMobile) {
      // Prevent scrolling when modal is open
      document.body.style.overflow = showDatePickers ? "hidden" : "auto";
    }
    return () => {
      // Cleanup overflow style on modal close
      document.body.style.overflow = "auto";
    };
  }, [showDatePickers]);

  const totalAdults = rooms?.reduce((sum, room) => sum + room.adults, 0);
  return (
    <>
      <div className="flex items-center gap-2 relative rounded  w-full h-full ">
        <div className="flex md:flex-row flex-col items-center gap-4 h-full w-full">
          <div className="relative w-full">
            <div
              className="bg-white flex md:flex-row flex-col items-center md:py-0 cursor-pointer justify-between gap-4  w-full  "
              onClick={handleShowDatePickers}
              ref={flagRef}
            >
              <div className=" flex  items-center justify-between w-full gap-2">
                <div className="xl:flex items-center gap-2 hidden">
                  <MdDateRange size={22} className="text-gray-700" />
                  <div className="flex items-center justify-between w-[10vw] 2xl:w-[12vw]">
                    <div className="flex flex-col items-start gap-1">
                      <div className=" text-gray-500 truncate">Check In</div>

                      <div className="font-medium truncate">
                        {checkInDate ? checkInDate.format("ddd DD MMM") : ""}
                      </div>
                    </div>
                    {showDatePickers ? (
                      <IoIosArrowUp size={20} className="cursor-pointer" />
                    ) : (
                      <IoIosArrowDown size={20} className="cursor-pointer" />
                    )}
                  </div>
                </div>
                <div className="w-[1px] bg-slate-200 h-[10vh] md:block hidden"></div>
                <div className="xl:flex items-center gap-2 hidden">
                  <MdDateRange size={22} className="text-gray-700" />
                  <div className="flex items-center justify-between w-[10vw] 2xl:w-[12vw]">
                    <div className="flex flex-col items-start gap-1">
                      <div className=" text-gray-500 truncate">Check Out</div>

                      <div className="font-medium truncate">
                        {checkOutDate ? checkOutDate.format("ddd DD MMM") : ""}
                      </div>
                    </div>
                    {showDatePickers ? (
                      <IoIosArrowUp size={20} className="cursor-pointer" />
                    ) : (
                      <IoIosArrowDown size={20} className="cursor-pointer" />
                    )}
                  </div>
                </div>
                <div className="xl:hidden block w-full ">
                  <div className="border-b w-full px-2 ">
                    <div className="flex items-center   gap-3 md:hidden w-full   py-2">
                      <MdDateRange size={22} className="text-gray-700" />
                      <div className="flex justify-between w-full items-center">
                        <div className="flex flex-col items-start gap-1 ">
                          <div className=" text-gray-500">Check In </div>
                          <div className="flex md:flex-row flex-col gap-2 w-full">
                            <div className="font-medium">
                              {checkInDate
                                ? checkInDate.format("ddd DD MMM")
                                : ""}
                            </div>
                          </div>
                        </div>
                        {showDatePickers ? (
                          <IoIosArrowUp size={20} className="cursor-pointer" />
                        ) : (
                          <IoIosArrowDown
                            size={20}
                            className="cursor-pointer"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border-b px-2 w-full">
                    <div className="flex items-center   gap-3 md:hidden w-full   py-2">
                      <MdDateRange size={22} className="text-gray-700" />
                      <div className="flex justify-between w-full items-center">
                        <div className="flex flex-col items-start gap-1 ">
                          <div className=" text-gray-500">Check Out </div>
                          <div className="flex md:flex-row flex-col gap-2 w-full">
                            <div className="font-medium">
                              {checkOutDate
                                ? checkOutDate.format("ddd DD MMM")
                                : ""}
                            </div>
                          </div>
                        </div>
                        {showDatePickers ? (
                          <IoIosArrowUp size={20} className="cursor-pointer" />
                        ) : (
                          <IoIosArrowDown
                            size={20}
                            className="cursor-pointer"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {showDatePickers && (
              <div
                ref={dropdownRef}
                className={`sm:absolute fixed sm:top-20 flex flex-col py-5 bg-white md:left-0 right-0 z-50 w-full ${
                  width
                    ? "h-[94vh] bottom-0"
                    : "h-[88vh] xl:h-[45vh] sm:h-[45vh] !xl:w-[50vw] sm:w-[60vw] bottom-0"
                } xl:w-[40vw] rounded-t-md md:rounded-md shadow-custom transition-transform duration-300 flex items-center justify-center ${
                  showDatePickers ? "translate-y-0" : "translate-y-full"
                }`}
              >
                <div
                  className={`px-5 flex md:flex-row flex-col md:gap-10  ${
                    width ? "gap-7 " : ""
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <button onClick={handlePrevMonth}>
                        <IoIosArrowBack size={20} />
                      </button>
                      <h3 className="font-bold text-lg text-center">
                        {currentMonth.format("MMMM YYYY")}
                      </h3>
                      <div></div>
                    </div>

                    {/* Day Names Row */}
                    <div className="grid grid-cols-7 gap-1 py-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (dayName) => (
                          <div
                            key={dayName}
                            className="text-center text-sm text-gray-500"
                          >
                            {dayName}
                          </div>
                        )
                      )}
                    </div>

                    {/* Current Month Days */}
                    <div className="grid grid-cols-7 text-sm ">
                      {currentMonthDays.map((day) => {
                        const uniqueMonths = new Set(
                          currentMonthDays.map((day) => day.month())
                        );
                        const numberOfUniqueMonths = uniqueMonths.size; // Count of unique months

                        const shouldHide =
                          numberOfUniqueMonths > 1 &&
                          day.month() === currentMonthDays[0].month();
                        return (
                          <button
                            key={day.toString()} // Ensure the key is unique, you can also use day.format('YYYY-MM-DD') for better uniqueness
                            className={`p-3 px-4 text-center cursor-pointer ${
                              shouldHide
                                ? "text-transparent pointer-events-none" // Hide and disable pointer events if needed
                                : day.isBefore(today, "day")
                                ? "text-gray-400" // Past dates styling
                                : hasUserSelected // Check if the user has made a selection
                                ? day.isSame(checkInDate)
                                  ? "text-white rounded-l bg-blue-500" // Check-in date styling
                                  : day.isSame(checkOutDate)
                                  ? "text-white rounded-r bg-blue-500" // Check-out date styling
                                  : isInRange(day)
                                  ? "bg-gray-300" // Styling for dates between check-in and check-out
                                  : isInHoverRange(day)
                                  ? "bg-gray-300" // Hover range styling
                                  : "hover:bg-gray-300" // Default hover styling
                                : day.isSame(today, "day") // Check if it's today
                                ? "text-white bg-blue-500 rounded-l" // Apply rounded-l for today
                                : day.isSame(today.add(1, "day"), "day") // Check if it's tomorrow
                                ? "text-white bg-blue-500 rounded-r" // Apply rounded-r for tomorrow
                                : "hover:bg-gray-300" // Default hover styling
                            }`}
                            onClick={() => !shouldHide && handleDateClick(day)} // Handle click if not hidden
                            onMouseEnter={() =>
                              !shouldHide && setHoveredDate(day)
                            } // Set hovered date if not hidden
                            onMouseLeave={() =>
                              !shouldHide && setHoveredDate(null)
                            } // Reset hovered date on leave if not hidden
                          >
                            {day.date()} {/* Display the day number */}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Next Month Days */}
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4 ">
                      <div></div>
                      <h3 className="font-bold text-lg text-center">
                        {currentMonth.add(1, "month").format("MMMM YYYY")}
                      </h3>
                      <button onClick={handleNextMonth}>
                        <IoIosArrowForward size={20} />
                      </button>
                    </div>

                    {/* Day Names Row for Next Month */}
                    <div className="grid grid-cols-7 gap-1">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (dayName) => (
                          <div
                            key={dayName}
                            className="text-center text-sm text-gray-500"
                          >
                            {dayName}
                          </div>
                        )
                      )}
                    </div>

                    {/* Next Month Days */}
                    <div className="grid grid-cols-7 text-sm mt-2 ">
                      {nextMonthDays.map((day) => {
                        const shouldHide =
                          day.month() ===
                          currentMonthDays[currentMonthDays.length - 1].month();

                        return (
                          <div
                            key={day.toString()} // Ensure the key is unique, you can also use day.format() for better uniqueness
                            className={`p-3 px-4 text-center cursor-pointer ${
                              shouldHide
                                ? "text-transparent pointer-events-none" // Make text transparent and disable pointer events
                                : day.isBefore(today, "day")
                                ? "text-gray-400"
                                : day.isSame(checkInDate)
                                ? "text-white rounded-l bg-blue-500"
                                : day.isSame(checkOutDate)
                                ? "text-white rounded-r bg-blue-500"
                                : isInRange(day)
                                ? "bg-gray-300"
                                : isInHoverRange(day)
                                ? "bg-gray-300" // Change this color as needed for the hover range
                                : "hover:bg-gray-300"
                            }`}
                            onClick={() => !shouldHide && handleDateClick(day)} // Only handle click if not hidden
                            onMouseEnter={() =>
                              !shouldHide && setHoveredDate(day)
                            } // Set hovered date on hover if not hidden
                            onMouseLeave={() =>
                              !shouldHide && setHoveredDate(null)
                            } // Reset hovered date on leave if not hidden
                          >
                            {day.date()}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className=" flex items-center justify-center px-3 md:hidden w-full">
                  <button
                    className="bg-[#795f9e] text-white px-2 py-2 w-full rounded-md"
                    onClick={handleShowDatePickers}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="w-[4px] bg-slate-200 h-[10vh] md:block hidden"></div>
          <div className="bg-white flex items-center relative  justify-between   w-full  md:px-0">
            <button
              className="flex  items-center justify-between xl:w-[18vw]  gap-2 w-full"
              ref={flag1Ref}
              onClick={() => {
                setGuestCardVisible(!guestCardVisible);
                setShowDatePickers(false);
              }}
            >
              <LuHotel size={25} />
              <div className="flex flex-col items-start w-full gap-1">
                <div className="w-full text-left text-gray-500 truncate">
                  Rooms & Guests
                </div>
                <div className="font-semibold rounded-md cursor-pointer  w-full justify-between  flex items-center gap-20">
                  {rooms?.length} room , {totalAdults} adult
                </div>
              </div>
              <div>
                {guestCardVisible ? (
                  <IoIosArrowUp size={20} className="cursor-pointer" />
                ) : (
                  <IoIosArrowDown size={20} className="cursor-pointer" />
                )}
              </div>
            </button>
            {guestCardVisible && (
              <div
                ref={dropdown1Ref}
                className={`md:absolute fixed md:top-[70px] md:bottom-auto bottom-0 md:h-auto h-screen pt-1 gap-5 left-0 flex flex-col z-40 xl:w-[22vw] sm:w-[30vw] w-full shadow-custom md:rounded-md md:border-2 border-textColor bg-white pb-3 zoom-in`}
              >
                <div className=" flex flex-col gap-5   md:max-h-[40vh]  max-h-[90vh] overflow-y-auto custom-scrollbar ">
                  {rooms.map((room, index) => (
                    <div key={room.id} className="flex flex-col gap-6">
                      <div className="flex items-center justify-between bg-gray-200 py-3 px-2">
                        <h1 className="">Room {index + 1}</h1>
                        {rooms.length > 1 && (
                          <button
                            className="uppercase text-sm text-[#3e1b6e] font-medium"
                            onClick={() => removeRoom(room.id)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="flex items-center justify-between w-full px-2">
                        No. of adults
                        <div className="flex items-center gap-4 px-2">
                          <button
                            className="bg-gray-300 w-7 h-7 flex justify-center rounded-full"
                            onClick={() => handleAdultChange(room.id, -1)}
                          >
                            <FaRegWindowMinimize color="gray" />
                          </button>
                          <div>{room.adults}</div>
                          <button
                            className="bg-gray-300 w-7 h-7 flex justify-center items-center rounded-full"
                            onClick={() => handleAdultChange(room.id, 1)}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-2 flex w-full items-center justify-between border-t pt-3">
                  <button
                    className="text-[#3e1b6e] font-semibold py-2"
                    onClick={addRoom}
                  >
                    Add New Room
                  </button>
                  <button
                    className="bg-textColor px-5 text-white rounded-3xl font-semibold py-1 hidden md:block"
                    onClick={() => setGuestCardVisible(false)}
                  >
                    Done
                  </button>
                </div>
                <div className="px-2 w-full absolute bottom-4 md:hidden block">
                  <button
                    className="bg-textColor px-5 text-white rounded-3xl font-semibold py-3 w-full"
                    onClick={() => setGuestCardVisible(false)}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="w-[4px] bg-slate-200 h-[10vh] md:block hidden"></div>
        </div>
      </div>
    </>
  );
};

export default CustomBookingDatePicker;

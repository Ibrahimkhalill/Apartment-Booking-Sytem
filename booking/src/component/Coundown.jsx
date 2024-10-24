import React, { useState, useEffect, useCallback, useRef } from "react";
import axiosInstance from "./axioxinstance";
import { BsClockHistory } from "react-icons/bs";

const CountdownTimer = ({
  roomId,
  uuid,
  setMessgesModalVisible,
  setMessages,
  setNavigate,
  setTimeLeft,
  timeLeft,
}) => {

  const timerRef = useRef(null);



  const releaseRoom = useCallback(async () => {
    try {
      const response = await axiosInstance.post(`/release-room/${uuid}/`);
      console.log(response.data.message);
      if (response.status === 200) {
        setMessgesModalVisible(true);
        setMessages(response.data.message);
        setNavigate(-1);
      }
    } catch (error) {
      console.error("Error releasing room:", error);
    }
  }, [setMessages, setMessgesModalVisible, setNavigate, uuid]);

  useEffect(() => {
    // Function to validate and start the timer
    const validateAndStartTimer = () => {
      // Only start timer if there is time left
      if (timeLeft > 0) {
        timerRef.current = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime === 1) {
              // If time is about to reach zero
              clearInterval(timerRef.current); // Stop the timer
              releaseRoom(); // Release the room
              return 0; // Ensure timeLeft is zero
            }
            return prevTime - 1; // Decrease time by 1 second
          });
        }, 1000);
      }
    };

    validateAndStartTimer(); // Call function to validate and start the timer

    // Cleanup function to clear the timer
    return () => clearInterval(timerRef.current);
  }, [timeLeft, releaseRoom]); // Dependencies

  const formatTime = (seconds) => {
    if (seconds < 0) return "0 min 0 sec"; // Handle negative values

    const minutes = Math.floor(seconds / 60); // Calculate minutes
    const remainingSeconds = seconds % 60; // Calculate remaining seconds

    return `${minutes} min ${remainingSeconds} sec`; // Format time
  };

  if (timeLeft === null) {
    return <div>Loading...</div>; // Show loading state while waiting for remaining time
  }

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-red-700 font-medium">
      <BsClockHistory size={20} color="red" />
      <p> Time left to complete reservation: {formatTime(timeLeft)}</p>
    </div>
  );
};

export default CountdownTimer;

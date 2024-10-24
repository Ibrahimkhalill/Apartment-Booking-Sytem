export const handleSetData = ({ checkInDate, checkOutDate, rooms }) => {
    const checkInDateFormatted = checkInDate?.format("YYYY-MM-DD");
    const checkOutDateFormatted = checkOutDate?.format("YYYY-MM-DD");
    const roomData = JSON.stringify(rooms);
  
    function setCookie(name, value) {
      const date = new Date();
      // Set the date to midnight of the next day
      date.setHours(24, 0, 0, 0); // Set to the next day's midnight
  
      const expires = `expires=${date.toUTCString()}`;
      document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`; // Cookie path set to root
    }
  
    // Store the data as cookies
    setCookie("check_in_date", checkInDateFormatted); // Cookie expires at next midnight
    setCookie("check_out_date", checkOutDateFormatted); // Cookie expires at next midnight
    setCookie("roomData", roomData); // Cookie expires at next midnight
  };
  
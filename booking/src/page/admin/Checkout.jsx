import { GoCheckCircleFill } from "react-icons/go";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";

import Country from "./../../json/country_codes_data.json";
import CountryFlag from "./../../json//by-code.json";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useSelector } from "react-redux";

import CountdownTimer from "../../component/Coundown";
import MessagesModal from "../../component/MessagesModal";
import dayjs from "dayjs";
import Sidebar from "../../component/admin/Sidebar";
import axiosInstance from "../../component/axioxinstance";
const Checkout = () => {
  const checkInDate = useSelector((state) => state.booking.checkInDate);
  const checkOutDate = useSelector((state) => state.booking.checkOutDate);
  const rooms = useSelector((state) => state.booking.rooms);
  const [title, setTitle] = useState("");
  const [first_name, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const location = useLocation();
  const [code, setCode] = useState("880");
  const [phoneNumberLength, setPhoneNumberLength] = useState(11);
  const [country_name, setCountryName] = useState("");
  const [flag, setFlag] = useState("");
  const countryArray = Object.values(CountryFlag);
  const selectedRef = useRef(null); // Ref for the selected country element
  const dropdownRef = useRef(null); // Ref for the dropdown container
  const [filteredCountries, setFilteredCountries] = useState(Country);
  const flagRef = useRef(null);
  const [openUpward, setOpenUpward] = useState(false);
  const { adults, uuid } = location.state || {};
  const [data, setData] = useState({});
  const [loading, setLoaing] = useState(false);
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(null);
  const [messagesmodalVisible, setMessgesModalVisible] = useState(false);
  const [messges, setMessges] = useState("");
  const [nevigate, setNavigate] = useState("");
  const [error, setError] = useState(false);
  const [Emailerror, setEmailError] = useState("");
  const [PhoneError, setPhoneError] = useState("");

  const handlecountry = (e) => {
    const filter = Country.filter((data) =>
      data.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
    );
    setFilteredCountries(filter);
  };

  const [isOpen, setIsOpen] = useState(false); // To control dropdown visibility
  const toggleDropdown = () => {
    if (!isOpen && flagRef.current) {
      const dropdownHeight = 300; // Assuming the height of the dropdown
      const windowHeight = window.innerHeight;
      const { bottom, top } = flagRef.current.getBoundingClientRect();

      // Check if there's enough space below, otherwise open upwards
      if (windowHeight - bottom < dropdownHeight && top > dropdownHeight) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
    setIsOpen(!isOpen);
  };
  const handleSelectCountry = (country) => {
    setCode(country.dial_code);
    setCountryName(country.name);
    setPhoneNumberLength(country.mobile_number_length);

    setIsOpen(false); // Close dropdown after selection
  };
  useEffect(() => {
    if (code) {
      // Find the selected country's details based on the dial_code
      const selectedCountry = Country.find((data) => data.dial_code == code);

      if (selectedCountry) {
        // Find the corresponding flag image using the country code
        const flagData = countryArray.find(
          (item) =>
            item.name.toLocaleLowerCase() ==
            selectedCountry.name.toLocaleLowerCase()
        );

        // Assuming emoji matches the country code in your data
        if (flagData) {
          setFlag(flagData.image); // Set the flag URL
        }
      }
    }
  }, [code, countryArray]); // Re-run effect when `code` changes

  useEffect(() => {
    if (isOpen && selectedRef.current) {
      // Scroll to the selected item in the dropdown
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setTimeout(() => {
        setIsOpen(true); // Set dropdown to open after scrolling
      }, 400);
    }
  }, [code, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        flagRef.current &&
        !flagRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const [paymentVisible, setPaymentVisible] = useState(false);

  const handlesubmit = () => {
    setPaymentVisible(true);
  };

  const calculateNights = (checkIn, checkOut) => {
    console.log(checkIn);

    if (checkIn.isValid() && checkOut.isValid()) {
      // Ensure checkOut is after checkIn
      if (checkOut.isBefore(checkIn)) {
        return 0; // Return 0 if checkOut is before checkIn
      }
      const nights = checkOut.diff(checkIn, "day"); // Calculate the difference in days
      console.log(nights);

      return nights;
    }
    return 0; // Return 0 if dates are not valid
  };

  // Usage
  const nights = calculateNights(
    dayjs(data.booking?.check_in_date),
    dayjs(data.booking?.check_out_date)
  );

  const amount =
    data.booking?.room_id?.price * nights * data.booking?.room_quantity;

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format regex
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone) => {
    if (code == "880") {
      // If the country code is Bangladesh
      const localPhone = !phone.startsWith("0") ? "0" + phone : phone;
      setPhoneNumber(localPhone);
      if (localPhone.length === phoneNumberLength) {
        setPhoneError("");
      }
      // Ensure localPhone is 11 digits for Bangladesh
      return localPhone.length === phoneNumberLength;
    }

    return phone.length === phoneNumberLength;
  };
  const isValid = (first_name, lastName, email, address, phone) => {
    let hasError = false;

    // Check if all required fields are present
    if (!first_name || !lastName || !email || !address || !phone) {
      setError(true);
      hasError = true;
    }

    // Check email format
    if (email && !isValidEmail(email)) {
      setEmailError("Please fill in a valid email address");
      setError(true);
      hasError = true;
    }

    // Check phone number format
    if (phone && !isValidPhoneNumber(phone)) {
      setPhoneError("Please fill in a valid phone number");
      setError(true);
      hasError = true;
    }

    // Scroll to top if there's an error
    if (hasError) {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Smooth scroll
      });
      return false; // Invalid if any required field is missing or invalid
    }

    return true; // All required fields are present and valid
  };

  const formatPhoneNumber = (phoneNumber) => {
    // Remove leading zero if it exists
    if (phoneNumber.startsWith("0")) {
      phoneNumber = phoneNumber.slice(1);
    }
    // Concatenate the country code
    return code + phoneNumber;
  };
  const handleSubmit = async () => {
    if (!isValid(first_name, lastName, email, address, phoneNumber)) {
      return; // Exit if validation fails
    }
    const formattedPhone = formatPhoneNumber(phoneNumber);
    try {
      setLoaing(true);

      const response = await axiosInstance.post(
        `api/reservation/${data.booking?.room_id?.id}`,
        {
          name: title + " " + first_name + " " + lastName,
          email: email,
          address: address,
          phone_number: formattedPhone,
          check_in: checkInDate?.format("YYYY-MM-DD"),
          check_out: checkOutDate?.format("YYYY-MM-DD"),
          room_quantity: rooms.length,
          adults: adults,
          special_request: specialRequest,
          arrival_time: arrivalTime,
          amount: amount,
        }
      );

      if (response.status === 201) {
        const queryParams = {
          Confirmation_number: response.data.confirmation_number,
        };
        const queryString = new URLSearchParams(queryParams).toString();
        navigate(`/admin/room/booking/confirmation?${queryString}`);
        setLoaing(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchBookingDetails = async (prebookingId) => {
    try {
      const response = await axiosInstance.get(
        `/api/get_booking/${prebookingId}/`
      ); // Fetch booking data
      console.log("ddfg", response);

      if (response.status === 200) {
        const remainingTime = response.data.remaining_time; // Get remaining time
        if (remainingTime > 0) {
          setTimeLeft(Math.floor(remainingTime)); // Set remaining time if valid
        } else {
          setMessgesModalVisible(true);
          setMessges(response.data.error);
          setNavigate("/");
        }
        setData(response.data);
      } else {
        setMessgesModalVisible(true);
        setMessges("Prebooking not found");
        setNavigate("/");
      }
    } catch (error) {
      console.error("Invalid UUID:", error);
      navigate("*"); // Redirect to main page if UUID is invalid
    }
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll
    });
    const queryParams = new URLSearchParams(window.location.search);
    const prebookingId = queryParams.get("prebookingId");

    if (prebookingId) {
      fetchBookingDetails(prebookingId); // Fetch details using the UUID
    } else if (location.state?.uuid) {
      fetchBookingDetails(location.state?.uuid); // Fallback to the UUID from the state
    }
  }, []);
  // 3b1ccb1b-56cd-4a88-a3ec-b72c24b87f73

  return (
    <Sidebar>
      <main className="container m-auto  w-full pb-10 px-2 ">
        <div className="w-full flex items-center justify-center gap-2 md:my-0 mb-10 ">
          <div className="flex items-center gap-2">
            <GoCheckCircleFill size={27} color="#795f9e" />
            <p className="font-bold text-sm md:block hidden">Your Selection</p>
          </div>
          <div className="w-[30%] border border-[#747474]"></div>
          <div className="flex md:flex-row flex-col items-center gap-2 relative ">
            {paymentVisible ? (
              <GoCheckCircleFill size={27} color="#795f9e" />
            ) : (
              <div className="w-[27px] h-[27px] bg-[#795f9e] text-sm text-white border rounded-full flex items-center justify-center text-center">
                2
              </div>
            )}

            <p className="font-bold text-sm absolute top-7 md:w-auto w-[100px] text-center  md:relative md:top-auto">
              Your Details
            </p>
          </div>
          <div className="w-[30%] border border-[#747474]"></div>
          <div className="flex items-center gap-2">
            {paymentVisible ? (
              <div className="w-[27px] h-[27px] bg-[#795f9e] text-sm text-white border rounded-full flex items-center justify-center text-center">
                3
              </div>
            ) : (
              <div className="w-[27px]  tex-sm  h-[27px]  border-2 text-sm  rounded-full flex items-center justify-center text-center">
                3
              </div>
            )}
            <p className="font-bold text-sm md:block hidden">
              Confirm reservation
            </p>
          </div>
        </div>

        <div className="py-4 mt-3 w-full text-center bg-[#e7fde9] rounded-md border-b-4 border-[#35943d] flex flex-col items-center justify-center gap-2">
          <div className="font-medium">
            Your booking is guaranteed for a limited time only.
          </div>
          <CountdownTimer
            roomId={data.booking?.room_id?.id}
            uuid={uuid}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            setMessgesModalVisible={setMessgesModalVisible}
            setMessages={setMessges}
            setNavigate={setNavigate}
          />
        </div>

        <div className="w-full flex md:flex-row flex-col gap-3">
          <div className="md:w-[25%]">
            <div className="w-full border flex flex-col  mt-4 rounded">
              <img src="/images/banner2.jpg" alt="" className="rounded" />
              <div className="px-2 py-3 flex flex-col gap-2 ">
                <h3 className="text-lg font-semibold">
                  Basundara Apartment, Dhaka
                </h3>
                <p className=" text-sm">
                  Airport Rd, Dhaka Cantonment, Dhaka, 1206, Bangladesh
                </p>
                <p className=" w-full flex items-center text-sm text-[#1b5a20] font-medium">
                  This property is in a good location
                </p>
              </div>
            </div>
            <div className="w-full border flex flex-col  mt-4 rounded border-[#b5c5dd]">
              <div className="bg-[#ebf3ff] text-black font-medium py-2 px-3 border-b ">
                Your booking details
              </div>
              <div className="px-3 py-2 text-sm flex flex-col gap-2">
                <h1>Occupancy</h1>
                {data.booking?.room_quantity} room, {data.booking?.adults}{" "}
                adults
              </div>
              <div className="px-3 py-2 text-sm flex flex-col gap-2">
                <div>
                  <span className="font-bold">Check In:</span> <br />{" "}
                  {checkInDate.format("ddd , DD MMM YYYY")} - 3:00 PM
                </div>
                <div>
                  <span className="font-bold">Check Out:</span>
                  <br /> {checkOutDate.format("ddd , DD MMM YYYY")} - 12:00 PM
                </div>
                <div>
                  <span className="font-bold">Total length of stay:</span>
                  <br /> {nights} nights
                </div>
              </div>
            </div>
            <div className="w-full border flex flex-col  mt-4 rounded border-[#b5c5dd]">
              <div className="bg-[#ebf3ff] text-black font-medium py-2 px-3 border-b ">
                Your price summary
              </div>
              <div className="px-3 py-2 text-sm flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="">Room cost per night:</span>
                  <p>BDT {data.booking?.room_id?.price} </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="">{nights} nights</span>
                  <p> x{nights}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="">{rooms.length} rooms</span>
                  <p> x{rooms.length}</p>
                </div>
                <div className="flex items-center justify-between border-t py-2">
                  <span className="font-bold">Total Price:</span>
                  <p className="font-bold">BDT {amount}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="py-2 md:w-[75%]">
            <h1 className="text-2xl text-gray-700 font-semibold">
              My reservation
            </h1>
            <div className="flex items-center  border px-2 py-2 w-full my-4">
              <span>
                <Link className="text-blue-500">Sign in</Link>
                <span className="mx-1">to book with your saved details or</span>
                <Link className="text-blue-500">register</Link>
                <span className="ml-1">to manage your bookings on the go!</span>
              </span>
            </div>
            {paymentVisible ? (
              <div className="border  bg-[#d3dbe7] px-3 py-5 rounded-md"></div>
            ) : (
              <div className="  rounded-md flex flex-col gap-3">
                <div className="bg-white border rounded-md px-3 py-5">
                  <div className="flex gap-2 md:w-[70%]">
                    <div className="flex flex-col items-start gap-1 ">
                      <label htmlFor="title" className="font-medium text-sm">
                        Title
                      </label>
                      <select
                        id="title"
                        className={
                          "border-slate-400 w-[100px] py-[7px] border outline-none rounded-md text-sm  px-2"
                        }
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                      >
                        <option></option>
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Mrs.">Mrs.</option>
                      </select>
                    </div>
                    <div className="flex flex-col items-start gap-1 w-[32%] relative">
                      <label htmlFor="" className="font-medium text-sm">
                        First Name*
                      </label>
                      <input
                        type="text"
                        className={`py-2 border  outline-none rounded-md px-2 text-sm w-full ${
                          !first_name && error
                            ? "border-red-700"
                            : "border-slate-400"
                        }`}
                        onChange={(e) => setFirstName(e.target.value)}
                        value={first_name}
                      />
                      {!first_name && error && (
                        <div className="absolute bottom-7 right-2">
                          <MdErrorOutline size={23} className="text-red-700" />
                        </div>
                      )}
                      {!first_name && error && (
                        <div className="text-xs text-red-700">
                          Please fill in your first name
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-start gap-1 w-[33%] relative">
                      <label htmlFor="" className="font-medium text-sm">
                        Last Name*
                      </label>
                      <input
                        type="text"
                        className={`py-2 border  outline-none rounded-md px-2 text-sm w-full ${
                          !lastName && error
                            ? "border-red-700"
                            : "border-slate-400"
                        }`}
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                      />
                      {!lastName && error && (
                        <div className="absolute bottom-7 right-2">
                          <MdErrorOutline size={23} className="text-red-700" />
                        </div>
                      )}
                      {!lastName && error && (
                        <div className="text-xs text-red-700">
                          Please fill in your first name
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="my-7  flex flex-col gap-7">
                    <div className="flex flex-col items-start gap-1 w-full relative">
                      <div className="flex flex-col items-start gap-1 md:w-[59%] w-full relative">
                        <label htmlFor="" className="font-medium text-sm">
                          Email*
                        </label>
                        <input
                          type="email"
                          className={`py-2 border outline-none rounded-md px-2 text-sm w-full ${
                            (!email || Emailerror) && error
                              ? "border-red-700"
                              : "border-slate-400"
                          }  `}
                          placeholder="write your email address"
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                        />
                        {(!email || Emailerror) && error && (
                          <div className="absolute bottom-7 right-2">
                            <MdErrorOutline
                              size={23}
                              className="text-red-700"
                            />
                          </div>
                        )}
                        {(!email || Emailerror) && error && (
                          <div className="text-xs text-red-700">
                            {Emailerror ? (
                              Emailerror
                            ) : (
                              <span> Please fill in your email address</span>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        By providing an valide email, I agree to receive
                        information about online check-in, online check-out and
                        offers to personalize my stays via email from Basundara
                        Apartment Group. We will also use this email to send
                        your confirmation email.
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-1 md:w-[59%] w-full relative">
                      <label htmlFor="" className="font-medium text-sm">
                        Adress*
                      </label>
                      <input
                        type="text"
                        className={`py-2 border outline-none rounded-md px-2 text-sm  ${
                          !address && error
                            ? "border-red-700"
                            : "border-slate-400"
                        }  w-full`}
                        placeholder="write your address"
                        onChange={(e) => setAddress(e.target.value)}
                        value={address}
                      />
                      {!address && error && (
                        <div className="absolute bottom-7 right-2">
                          <MdErrorOutline size={23} className="text-red-700" />
                        </div>
                      )}
                      {!address && error && (
                        <div className="text-xs text-red-700">
                          Please fill in your address
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-start gap-1 md:w-[59%] w-full">
                      <label htmlFor="" className="font-medium text-sm">
                        Phone No*
                      </label>

                      <div className="flex gap-3 w-full relative">
                        <div
                          className="selected-flag bg-white border border-slate-400 px-2 rounded-md left-2 top-1 flex items-center gap-2 cursor-pointer"
                          onClick={toggleDropdown}
                          ref={flagRef}
                        >
                          {flag && (
                            <img
                              src={flag}
                              alt="Selected Country Flag"
                              width={30}
                              height={20}
                            />
                          )}
                          <MdOutlineKeyboardArrowDown size={35} />
                        </div>
                        {isOpen && (
                          <div
                            ref={dropdownRef}
                            className={`absolute ${
                              openUpward ? "bottom-full" : "top-full"
                            } bg-white border border-slate-400 rounded-md z-10 w-[230px]`}
                          >
                            <div className="w-ful">
                              <input
                                type="text"
                                className="w-full px-2 py-1 border-b border-0  rounded  border-slate-200 outline-0"
                                onChange={handlecountry}
                                placeholder="Search country..."
                              />
                            </div>
                            <div className="h-[50vh] overflow-y-auto">
                              {filteredCountries.map((data, index) => (
                                <div
                                  key={index}
                                  ref={
                                    data.name.toLocaleLowerCase() ==
                                    country_name.toLocaleLowerCase()
                                      ? selectedRef
                                      : null
                                  }
                                  className={`py-2 px-4 cursor-pointer hover:bg-gray-100 ${
                                    data.dial_code === code ? "bg-gray-300" : ""
                                  }`}
                                  onClick={() => handleSelectCountry(data)}
                                >
                                  {data.name} (+{data.dial_code})
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="w-full">
                          <div
                            className={`flex items-center border bg-white ${
                              (!phoneNumber || PhoneError) && error
                                ? "border-red-700"
                                : "border-slate-400"
                            } rounded-md w-full px-1`}
                          >
                            <div className="flex items-center  pl-1 b0">
                              {/* Display the selected country code */}
                              <span className="">+{code}</span>
                            </div>
                            <div className="border h-6 mx-1 border-slate-200"></div>
                            <input
                              type="text"
                              className="py-2 outline-none border-0 px-1 text-sm w-full"
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              value={phoneNumber}
                            />
                          </div>
                          {(!phoneNumber || PhoneError) && error && (
                            <div className="absolute bottom-2 right-2">
                              <MdErrorOutline
                                size={23}
                                className="text-red-700"
                              />
                            </div>
                          )}
                          {(!phoneNumber || PhoneError) && error && (
                            <div className="text-xs text-red-700 absolute mt-1">
                              {PhoneError ? (
                                PhoneError
                              ) : (
                                <span> Please fill in a your phone number</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white px-3 py-5 flex flex-col gap-4 border rounded-md relative">
                  <h1 className="text-xl font-semibold">Special requests</h1>
                  <p className="text-sm">
                    Special requests cannot be guaranteed – but the property
                    will do its best to meet your needs. You can always make a
                    special request after your booking is complete!
                  </p>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="text-area"
                      className="font-semibold text-sm"
                    >
                      Please write your requests. (optional)
                    </label>
                    <textarea
                      id="text-area"
                      className="border border-slate-300 rounded-md outline-[#795f9e] px-2"
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="bg-white px-3 py-5 flex flex-col gap-4 border rounded-md">
                  <h1 className="text-xl font-semibold">Arrival Time</h1>
                  <p className="text-sm flex items-center gap-3">
                    <IoCheckmarkCircleOutline size={28} color="#795f9e" /> Your
                    room will be ready for check-in at 12:00
                  </p>
                  <p className="text-sm flex items-center gap-4">
                    <svg
                      className="bk-icon -streamline-front_desk"
                      fill="#795f9e"
                      height="24"
                      width="24"
                      viewBox="0 0 24 24"
                      role="presentation"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M14.244 14.156a6.75 6.75 0 0 0-6.75-5.906A6.747 6.747 0 0 0 .73 14.397a.75.75 0 0 0 1.494.134 5.25 5.25 0 0 1 5.27-4.781 5.253 5.253 0 0 1 5.262 4.594.75.75 0 1 0 1.488-.188zM10.125 4.125a2.625 2.625 0 1 1-5.25 0V1.5h5.25v2.625zm1.5 0V1.5a1.5 1.5 0 0 0-1.5-1.5h-5.25a1.5 1.5 0 0 0-1.5 1.5v2.625a4.125 4.125 0 0 0 8.25 0zM23.25 22.5H.75l.75.75v-7.5a.75.75 0 0 1 .75-.75h19.5a.75.75 0 0 1 .75.75v7.5l.75-.75zm0 1.5a.75.75 0 0 0 .75-.75v-7.5a2.25 2.25 0 0 0-2.25-2.25H2.25A2.25 2.25 0 0 0 0 15.75v7.5c0 .414.336.75.75.75h22.5zM4.376 5.017a9.42 9.42 0 0 1 3.12-.517 9.428 9.428 0 0 1 3.133.519.75.75 0 0 0 .49-1.418A10.917 10.917 0 0 0 7.498 3a10.91 10.91 0 0 0-3.611.6.75.75 0 0 0 .49 1.417zM15.75 14.27a3.001 3.001 0 0 1 6 .16.75.75 0 1 0 1.5.04 4.501 4.501 0 1 0-9-.24.75.75 0 1 0 1.5.04zm3.75-3.77V8.25a.75.75 0 0 0-1.5 0v2.25a.75.75 0 0 0 1.5 0zM17.25 9h3a.75.75 0 0 0 0-1.5h-3a.75.75 0 0 0 0 1.5z"></path>
                    </svg>
                    24-hour front desk – Help whenever you need it!
                  </p>
                  <div className="flex flex-col gap-1 items-start">
                    <label
                      htmlFor="text-area"
                      className="font-semibold text-sm"
                    >
                      Add your estimated arrival time (optional)
                    </label>
                    <select
                      name="checkin_eta_hour"
                      className="border px-2 py-2 w-[300px] border-slate-400 rounded-md cursor-pointer"
                      id="checkin_eta_hour"
                      data-gtm-form-interact-field-id="3"
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                    >
                      <option value="" disabled="" selected="">
                        Please select
                      </option>
                      <option value="-1">I don't know</option>
                      <option value="0">00:00 – 01:00 </option>
                      <option value="1">01:00 – 02:00 </option>
                      <option value="2">02:00 – 03:00 </option>
                      <option value="3">03:00 – 04:00 </option>
                      <option value="4">04:00 – 05:00 </option>
                      <option value="5">05:00 – 06:00 </option>
                      <option value="6">06:00 – 07:00 </option>
                      <option value="7">07:00 – 08:00 </option>
                      <option value="8">08:00 – 09:00 </option>
                      <option value="9">09:00 – 10:00 </option>
                      <option value="10">10:00 – 11:00 </option>
                      <option value="11">11:00 – 12:00 </option>
                      <option value="12">12:00 – 13:00 </option>
                      <option value="13">13:00 – 14:00 </option>
                      <option value="14">14:00 – 15:00 </option>
                      <option value="15">15:00 – 16:00 </option>
                      <option value="16">16:00 – 17:00 </option>
                      <option value="17">17:00 – 18:00 </option>
                      <option value="18">18:00 – 19:00 </option>
                      <option value="19">19:00 – 20:00 </option>
                      <option value="20">20:00 – 21:00 </option>
                      <option value="21">21:00 – 22:00 </option>
                      <option value="22">22:00 – 23:00 </option>
                      <option value="23">23:00 – 00:00 </option>
                      <option value="24">00:00 – 01:00 (the next day)</option>
                      <option value="25">01:00 – 02:00 (the next day)</option>
                    </select>
                  </div>
                </div>
                <div className="mantine-TextInput-wrapper mantine-12sbrde">
                  <input
                    placeholder="Enter strong password minimum 6 character "
                    type="checkbox"
                    required=""
                    aria-invalid="false"
                    value=""
                    id="check"
                  />
                  <label htmlFor="check" className=" ml-2">
                    I accept all of the
                    <span className="text-sky-500 ml-1">
                      terms and conditions
                    </span>{" "}
                    of the Basundara Aparment, including the
                    <span className="text-sky-500 ml-1">privacy policy</span>.
                  </label>
                </div>
                <div className="my-3 flex flex-col items-start gap-2">
                  <button
                    className="bg-[#795f9e] w-full md:w-auto px-20 py-3 text-white rounded shadow-md border border-[#795f9e] flex items-center justify-center gap-3"
                    onClick={handleSubmit}
                  >
                    {loading ? (
                      <span className="loader"></span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Next: Final Deatils <IoIosArrowForward size={20} />
                      </span>
                    )}
                  </button>
                  <p style={{ fontFamily: "serif" }}>
                    Don't worry — you won't be charged yet!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <MessagesModal
          messagesmodalVisible={messagesmodalVisible}
          setMessgesModalVisible={setMessgesModalVisible}
          data={messges}
          prebookingId={true}
          nevigate={nevigate}
        />
      </main>
    </Sidebar>
  );
};

export default Checkout;

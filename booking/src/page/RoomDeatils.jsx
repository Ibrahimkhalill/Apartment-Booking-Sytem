import { useEffect, useRef, useState } from "react";
import axiosInstance from "../component/axioxinstance";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

import CustomBookingDatePicker from "../component/CustomBookingDatePicker";
import { IoSearch } from "react-icons/io5";
import { RiCloseLargeFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { handleSetData } from "../component/Cookies";
import MessagesModal from "../component/MessagesModal";
const RoomDeatils = () => {
  const { id } = useParams();
  const [currentSlide, setCurrentSlide] = useState(1);
  const [animation, setAnimation] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const checkInDate = useSelector((state) => state.booking.checkInDate);
  const checkOutDate = useSelector((state) => state.booking.checkOutDate);
  const rooms = useSelector((state) => state.booking.rooms);
  const totalAdults = rooms?.reduce((sum, room) => sum + room.adults, 0);
  const [messagesmodalVisible, setMessgesModalVisible] = useState(false);
  const [messges, setMessges] = useState("");
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === data?.images?.length ? 1 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 1 ? data?.images?.length : prev - 1));
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axiosInstance.get(`api/get-room-details/${id}`);
        console.log(response.data);

        if (response.status === 200) {
          setData(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, [id]);

  const handlePrebooked = async (item) => {
    try {
      const response = await axiosInstance.post("/api/book_room/", {
        check_in: checkInDate?.format("YYYY-MM-DD"),
        check_out: checkOutDate?.format("YYYY-MM-DD"),
        room_quantity: rooms.length,
        adults: totalAdults,
        room: item.id,
      }); // Replace with your API endpoint

      if (response.status === 200) {
        const queryParams = {
          prebookingId: response.data.uuid,
        };
        const queryString = new URLSearchParams(queryParams).toString();
        navigate(`/checkout?${queryString}`, {
          state: {
            data: item,
            adults: totalAdults,
            uuid: response.data.uuid,
          },
        });
      } else {
        setMessgesModalVisible(true);
        setMessges(response.data.error);
      }
    } catch (error) {
      console.error("Error booking room:", error);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/api/search/available/room/${data.id}/`,
        {
          checkInDate: checkInDate?.format("YYYY-MM-DD"),
          checkOutDate: checkOutDate?.format("YYYY-MM-DD"),
          room_quantity: rooms.length,
          rooms: rooms,
        }
      );
      console.log("response.data", response);

      if (response.status === 200) {
        handlePrebooked(response.data);
        setLoading(false);
      } else {
        alert(response.data.error);
        setLoading(false);
      }
    } catch (error) {
      console.log(error.response);
      // Handle errors
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.error;
        setLoading(false);
        setMessgesModalVisible(true);
        setMessges(errorMessage);
        // Show the error message to the user
       
      } else {
        // Handle other errors (network issues, server errors, etc.)
        console.error("An error occurred:", error.message);
        alert("An error occurred while checking room availability.");
        setLoading(false);
      }
    }
  };
  return (
    <div className="flex items-center justify-center w-full flex-col">
      <div className="w-full md:h-[80vh] h-[50vh] relative">
        {data?.images?.[0]?.room_image ? (
          <img
            src={`http://127.0.0.1:8000${data.images[0].room_image}`}
            className="w-full h-full object-cover"
            alt="Room Image"
          />
        ) : (
          <p>No image available</p> // Fallback content if image is not available
        )}

        <div className="mask h-full "></div>
        <div className="absolute top-1/2 w-full left-1/2 -translate-x-1/2 -translate-y-1/2 z flex flex-col gap-4 items-center justify-center">
          <h1 className="text-white sm:text-5xl text-3xl font-medium uppercase">
            Room Details
          </h1>
          <p className="text-white text-center">
            For bookings and enquiries, please call us.
          </p>
        </div>
        <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 md:w-auto w-full">
          <div className=" w-full    sm:w-auto border-2 bg-white  border-[#795f9e] md:px-3 pl-3 pr-1 md:rounded rounded-3xl">
            <div className="md:flex hidden flex-row  md:gap-3 gap-4 items-center justify-center">
              <CustomBookingDatePicker />

              <div className=" flex flex-col gap-3 md:w-auto w-full">
                <button
                  className="bg-[#795f9e] text-white py-3 w-[15vw] shadow-md border border-[#795f9e] flex items-center gap-1 justify-center  rounded-3xl"
                  type="submit"
                  onClick={handleSearch}
                >
                  {loading ? (
                    <span className="loader"></span>
                  ) : (
                    <>
                      <span className="uppercase font-medium flex text-sm ">
                        Book Now
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <button
              className="flex items-center w-full py-1 md:hidden"
              onClick={() => setSearchVisible(!searchVisible)}
            >
              <input
                type="text"
                className="border-0 w-full rounded-full"
                placeholder="what are you next going"
                readOnly
              />
              <button className="bg-textColor py-2 px-2 text-white rounded-3xl">
                <IoSearch size={25} />
              </button>
            </button>
          </div>
        </div>
      </div>

      <div className="md:max-w-[77%] md:mx-0 mx-3 my-16">
        <h1 className="text-3xl font-semibold">{data.room_type}</h1>
        <div className="flex flex-wrap gap-3 py-5">
          <p className="bg-gray-200 px-2 py-1 text-sm rounded-lg">
            Size: {data?.size} m²
          </p>
          <p className="bg-gray-200 px-2 py-1 text-sm rounded-lg">
            Max. guests: {data?.room_people} adults
          </p>
          <p className="bg-gray-200 px-2 py-1 text-sm rounded-lg">
            Bed type: {data?.bed_type}
          </p>
        </div>

        <div className="flex md:flex-row flex-col gap-10 py-6 justify-between w-full">
          <div className="text-lg md:w-[60%]">
            <p>{data.room_description}</p>
            <div className="my-10">
              <h2 className="text-2xl font-medium">Availbale Features</h2>
              <div className="my-4 gap-5 grid md:grid-cols-2">
                {data?.features?.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={`http://127.0.0.1:8000${item.feature_images}`}
                      alt=""
                      className="w-9  h-9 object-cover"
                    />
                    <div className="text-[16px]">{item?.feature_name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:w-[40%] flex flex-col  gap-4 md:border-0 border-gray-400 pb-3">
            <div className="lg:h-[40vh] w-full">
              {data?.images?.map((slide, index) => (
                <div
                  key={index}
                  className={`${
                    index + 1 === currentSlide ? "block" : "hidden"
                  } duration-700 ease-in-out w-full h-full`}
                >
                  <img
                    src={`http://127.0.0.1:8000${slide?.room_image}`}
                    className="lg:rounded-md w-full h-full object-cover"
                    alt={`Slide ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <div className="w-full flex items-center justify-between lg:justify-center  gap-3 px-10">
              <button
                onClick={prevSlide}
                className="border w-[35px] h-[35px] rounded-full flex items-center justify-center border-black"
              >
                <IoIosArrowBack size={23} />
              </button>
              <div className="text-lg">
                {currentSlide} / {data?.images?.length}
              </div>
              <button
                onClick={nextSlide}
                className="border w-[35px] h-[35px] rounded-full flex items-center justify-center border-black"
              >
                <IoIosArrowForward size={23} />
              </button>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-medium">Check-in & Check-out Policy:</h1>
          <div>
            <ul className="list-disc px-10 py-5">
              <li className="mb-2">
                Check-in Time is 13:00 hours and Check-out Time is 12:00 hours.
              </li>
              <li className="mb-2">
                Early Check-in, Late Check-out or Extended Staying is subject to
                availability of room.
              </li>
              <li className="mb-2">
                50% of room charge is applicable for Early Morning Check-in or
                Late Check-out up to 6 pm. Late Check-out after 6 pm will be
                full charged.
              </li>
              <li>
                All guests must bring their Organizational Photo ID, NID card or
                Passport to be presented upon check-in.
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full my-3">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d912.4601703305208!2d90.4387781695695!3d23.824263725491527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7879873a351%3A0xeaa6e9866d86574c!2sH-Block%207%20No.%20Road%2C%20House%20no%20455!5e0!3m2!1sen!2sbd!4v1726997871799!5m2!1sen!2sbd"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowfullscreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      {searchVisible && (
        <div className=" zoom-in fixed z-50 top-0 left-0 px-5 w-full h-screen bg-[#263341] flex flex-col items-center justify-between py-10">
          <div className=" w-full flex items-end justify-end">
            <RiCloseLargeFill
              color="white"
              size={30}
              onClick={() => setSearchVisible(false)}
            />
          </div>
          <div className="text-5xl text-white">Find your next experience</div>
          <div className="py-3 lg:hidden block bg-white w-full  rounded-lg">
            <div className="flex lg:flex-row flex-col gap-3 items-center justify-center  ">
              <CustomBookingDatePicker width="width" />
            </div>
          </div>
          <div className=" mt-3 flex flex-col gap-3 w-[100%] lg:w-[20%]">
            <div></div>
            <button
              className="bg-[#795f9e] uppercase text-white text-lg flex items-center justify-center gap-2 font-medium  w-full py-3 px-2 rounded-3xl"
              type="submit"
              onClick={handleSearch}
            >
              <IoSearch size={25} />
              <span>Search</span>
            </button>
          </div>
        </div>
      )}
      <MessagesModal
        setMessgesModalVisible={setMessgesModalVisible}
        messagesmodalVisible={messagesmodalVisible}
        data={messges}
      />
    </div>
  );
};

export default RoomDeatils;

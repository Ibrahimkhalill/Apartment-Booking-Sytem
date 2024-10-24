import { MdWifiCalling1 } from "react-icons/md";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import ModalRoom from "../component/ModalRoom";
import MapModal from "../component/MapModal";
import { RiMapPin2Fill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiCloseLargeFill } from "react-icons/ri";
import CustomBookingDatePicker from "../component/CustomBookingDatePicker";

import axiosInstance from "../component/axioxinstance";
import { useDispatch, useSelector } from "react-redux";
import { handleSetData } from "../component/Cookies";
import MessagesModal from "../component/MessagesModal";
import {
  setCheckInDate,
  setCheckOutDate,
  setRooms,
} from "../component/bookingSlice";
import dayjs from "dayjs";
const AvilableRoom = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [roomData, setRoomData] = useState([]);
  const [roomDeatils, setRoomDeatils] = useState(null);
  const checkInDate = useSelector((state) => state.booking.checkInDate);
  const checkOutDate = useSelector((state) => state.booking.checkOutDate);
  const rooms = useSelector((state) => state.booking.rooms);
  const totalAdults = rooms?.reduce((sum, room) => sum + room.adults, 0);
  const [loading, setLoaing] = useState(false);
  const location = useLocation();
  const { data, adults } = location.state || {};
  const hasQueryParams = new URLSearchParams(location.search);
  const [messagesmodalVisible, setMessgesModalVisible] = useState(false);
  const [messges, setMessges] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const modalRef = useRef(null);

  const roomsParam = hasQueryParams.get("rooms");

  useEffect(() => {
    if (location.state) {
      setRoomData(data);
    } else {
      dispatch(setCheckInDate(dayjs(hasQueryParams.get("checkInDate")))); // Dispatch check-in date to Redux store
      dispatch(setCheckOutDate(dayjs(hasQueryParams.get("checkOutDate")))); // Set check-out date state
      const roomsArray = JSON.parse(decodeURIComponent(roomsParam));
      dispatch(setRooms(roomsArray)); // Set rooms state
    }
  }, []); // Add dependencies to ensure proper re-execution

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      handleSearch();
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = searchVisible ? "hidden" : "auto";
    return () => {
      // Cleanup overflow style on modal close
      document.body.style.overflow = "auto";
    };
  }, [searchVisible]);
  const queryParams = {
    placeId: "ChIJgWsCh7C4VTcRwgRZ3btjpY8",
    checkInDate: checkInDate?.format("YYYY-MM-DD"),
    checkOutDate: checkOutDate?.format("YYYY-MM-DD"),
    room: rooms.length,
    adults: totalAdults,
    rooms: JSON.stringify(rooms),
  };
  const queryString = new URLSearchParams(queryParams).toString();

  const handleSearch = async () => {
    try {
      setLoaing(true);
      const response = await axiosInstance.post("/api/search/available/room/", {
        checkInDate: checkInDate?.format("YYYY-MM-DD"),
        checkOutDate: checkOutDate?.format("YYYY-MM-DD"),
        room_quantity: rooms.length,
        rooms: rooms,
      });

      if (response.status === 200) {
        setRoomData(response.data);
         navigate(`/available_room?${queryString}`, {
          state: {
            data: response.data,
            adults: totalAdults,
          },
        });
        handleSetData({ checkInDate, checkOutDate, rooms });
        setLoaing(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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

  return (
    <div className="lg:container lg:m-auto flex flex-col items-center justify-center lg:max-w-[90%] xl:max-w-[100%] max-w-full pb-4">
      <div className="lg:bg-[#fff] rounded px-4 md:border md:shadow-md flex items-center justify-center lg:w-[95%] 2xl:w-[74%] w-full">
        <div
          className="px-10 py-4 border text-sm rounded-3xl border-textColor text-gray-500 sm:hidden block font-medium"
          onClick={() => setSearchVisible(!searchVisible)}
        >
          {checkInDate?.format("DD MMM")} - {checkOutDate?.format("DD MMM")} |{" "}
          {rooms.length} rooms , {totalAdults} Adults
        </div>
        {/* mobileview */}

        <div className="sm:flex w-full flex-row  md:gap-3 gap-4 items-center justify-center hidden">
          <CustomBookingDatePicker hasuser={true} />

          <div className=" flex flex-col gap-3 md:w-auto w-full">
            <button
              className="hover:bg-[#795f9e] font-semibold uppercase hover:text-white w-full py-3 px-16 shadow-md border border-[#baa2db]  rounded-3xl"
              type="submit"
              onClick={handleSearch}
            >
              {loading ? (
                <span className="loader"></span>
              ) : (
                <>
                  <span className="uppercase font-medium text-base">
                    Modify
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="lg:w-[95%] 2xl:w-[74%]   flex lg:flex-row flex-col items-start justify-center gap-2">
        <div className="lg:w-[26%] w-full flex flex-col">
          <div className="w-full border flex flex-col  mt-4 rounded">
            <img src="/images/banner2.jpg" alt="" className="rounded" />
            <div className="px-2 py-3 flex flex-col gap-2 ">
              <h3 className="text-lg font-semibold">
                Basundara Apartment, Dhaka
              </h3>
              <p className="text-[#a52a2a] text-sm">
                Airport Rd, Dhaka Cantonment, Dhaka, 1206, Bangladesh
              </p>
              <a
                href="tel:+8801746185116"
                className=" w-full flex items-center text-sm"
              >
                <MdWifiCalling1 size={18} /> +880 1746185116
              </a>
            </div>
          </div>
          <div
            className="w-full border relative  mt-4 rounded cursor-pointer hidden lg:block"
            onClick={() => setMapModalVisible(!mapModalVisible)}
          >
            <img src="/images/map.PNG" alt="" />

            <div className=" absolute top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2">
              <div className="flex flex-col items-center gap-2">
                <RiMapPin2Fill size={40} color="#795f9e" />
                <button className="bg-[#795f9e] text-white px-3 py-2 rounded-md text-sm">
                  Show on Map
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className=" lg:w-[75%] w-full lg:flex md:grid grid-cols-2 flex-col  gap-5 py-4 lg:px-0 px-2">
          {roomData &&
            roomData.map((data, index) => (
              <div
                key={index}
                className="border w-full rounded-md shadow flex lg:flex-row flex-col px-3 py-3 gap-5 "
              >
                <div className="lg:w-[40%] w-full">
                  <img
                    src={`http://127.0.0.1:8000${data.images[0]?.room_image}`} // Ensure this URL is correct
                    alt="" // Consider adding a descriptive alt text for accessibility
                    className="rounded w-full h-[230px]" // Tailwind CSS classes for styling
                  />
                </div>

                <div className="flex flex-col gap-2 ">
                  <h3 className="text-lg font-semibold">{data.room_type}</h3>
                  <div className="flex flex-wrap gap-3">
                    <p className="bg-gray-200 px-2 py-1 text-sm rounded-lg">
                      max. guests : {data.room_people} adults
                    </p>
                    <p className="bg-gray-200 px-2 py-1 text-sm rounded-lg">
                      bed type : 2 double or 1 king
                    </p>
                    <p className="bg-gray-200 px-2 py-1 text-sm rounded-lg">
                      size : 28 m²
                    </p>
                  </div>

                  <div className="flex gap-4 items-center mt-2">
                    {data.features?.slice(0, 3).map((feature, index) => (
                      <div key={feature.id} className="flex gap-5">
                        <img
                          src={`http://127.0.0.1:8000${feature.feature_images}`}
                          alt=""
                          width={25}
                        />
                        {index !== 2 && (
                          <div className="border-l-2 border-gray-400 h-6 "></div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-red-600">
                    Avaibale Room : {data.available_quantity}{" "}
                  </div>
                  <div className="text-[#882121] flex items-center gap-1 mt-1">
                    <button
                      className="uppercase font-semibold text-sm"
                      onClick={() => {
                        setModalVisible(!modalVisible);
                        setRoomDeatils(data);
                      }}
                    >
                      Room Details
                    </button>
                    <IoIosArrowRoundForward size={18} />
                  </div>
                  <div className="w-full flex items-start lg:items-end lg:justify-end  flex-col gap-2">
                    <p className="font-semibold">
                      {data.price} BDT /
                      <span className="text-sm text-gray-500">night</span>
                    </p>
                    <button
                      onClick={() => handlePrebooked(data)}
                      className=" w-full lg:w-auto bg-[#795f9e] text-white px-10 py-1 rounded-xl text-lg"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <ModalRoom
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        data={roomDeatils}
        modalRef={modalRef}
      />
      <MapModal
        mapModalVisible={mapModalVisible}
        setMapModalVisible={setMapModalVisible}
      />
      <MessagesModal
        setMessgesModalVisible={setMessgesModalVisible}
        messagesmodalVisible={messagesmodalVisible}
        data={messges}
      />
      {searchVisible && (
        <div className="zoom-in fixed z-50 top-0 left-0 px-5 w-full h-screen bg-[#263341] flex flex-col items-center justify-between py-10">
          <div className=" w-full flex items-end justify-end">
            <RiCloseLargeFill
              color="white"
              size={30}
              onClick={() => setSearchVisible(false)}
            />
          </div>
          <div className="text-5xl text-white">Find your next experience</div>
          <div className="py-5 lg:hidden block bg-white w-full  rounded-lg">
            <div className="flex lg:flex-row flex-col gap-3 items-center justify-center  ">
              <CustomBookingDatePicker hasuser={true} width="width" />
            </div>
          </div>
          <div className=" mt-3 flex flex-col gap-3 w-[100%] lg:w-[20%]">
            <div></div>
            <button
              className="bg-[#795f9e] uppercase text-white text-lg  w-full py-5 px-2 rounded-3xl"
              type="submit"
              onClick={() => {
                handleSearch();
                setSearchVisible(false);
              }}
            >
              <span>Modify</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvilableRoom;

import { useNavigate } from "react-router-dom";
import Sidebar from "../../component/admin/Sidebar";
import axiosInstance from "../../component/axioxinstance";
import { handleSetData } from "../../component/Cookies";
import CustomBookingDatePicker from "../../component/admin/CustomBookingDatePicker";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IoSearch } from "react-icons/io5";
import { IoIosArrowRoundForward } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
const AddReservation = () => {
  const checkInDate = useSelector((state) => state.booking.checkInDate);
  const checkOutDate = useSelector((state) => state.booking.checkOutDate);
  const rooms = useSelector((state) => state.booking.rooms);
  const totalAdults = rooms?.reduce((sum, room) => sum + room.adults, 0);
  const [searchVisible, setSearchVisible] = useState(false);
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoaing] = useState(false);
  const navigate = useNavigate();
  const [roomDeatils, setRoomDeatils] = useState(null);
  const [messagesmodalVisible, setMessgesModalVisible] = useState(false);
  const [messges, setMessges] = useState("");

  const [selectedRoom, setSelectedRoom] = useState("");
  const [roomData, setRoomData] = useState([]);
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
      const response = await axiosInstance.post("/api/get_available_rooms/", {
        checkInDate: checkInDate?.format("YYYY-MM-DD"),
        checkOutDate: checkOutDate?.format("YYYY-MM-DD"),
        room_type: selectedRoom,
        rooms: rooms,
      });

      if (response.status === 200) {
        console.log(response.data);

        setRoomData(response.data);
        handleSetData({ checkInDate, checkOutDate, rooms });
        setLoaing(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchdata = async () => {
    try {
      const response = await axiosInstance.get("/api/get_room/");
      if (response.status === 200) {
        setData(response.data);
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
        room: item.room_data.id,
      }); // Replace with your API endpoint

      if (response.status === 200) {
        const queryParams = {
          prebookingId: response.data.uuid,
        };
        const queryString = new URLSearchParams(queryParams).toString();
        navigate(`/admin/checkout/?${queryString}`, {
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

  useEffect(() => {
    handleSearch();
    fetchdata();
  }, []);
  return (
    <Sidebar>
      <div>
        <h1 className="text-center pb-5 text-2xl font-medium">
          Room Availability
        </h1>
        <div>
          <div className=" w-full   sm:w-auto border bg-white  md:px-3 pl-3 pr-1 md:rounded-lg rounded-3xl">
            <div className="xl:flex hidden flex-row  md:gap-3 gap-4 items-center justify-center">
              <CustomBookingDatePicker />
              <div className="flex items-center w-[25vw]">
                <div className="h-full flex flex-col items-start cursor-pointer w-full">
                  <div className="text-gray-500">Room type</div>
                  <select
                    className="border-0 font-medium cursor-pointer !p-0 w-full"
                    onChange={(e) => setSelectedRoom(e.target.value)}
                  >
                    <option value="">Select Room</option>
                    {data.map((item) => (
                      <option key={item.id}>{item.room_type}</option>
                    ))}
                  </select>
                </div>
                {selectedRoom ? (
                  <IoIosArrowUp size={20} className="cursor-pointer" />
                ) : (
                  <IoIosArrowDown size={20} className="cursor-pointer" />
                )}
              </div>
              <div className="w-[1px] bg-slate-200 h-[10vh] md:block hidden"></div>

              <div className=" flex flex-col gap-3 md:w-auto w-full">
                <button
                  className="bg-[#795f9e] text-white w-full py-2  px-2 2xl:px-10 shadow-md border border-[#795f9e] flex items-center gap-1 justify-center  rounded-xl"
                  type="submit"
                  onClick={handleSearch}
                >
                  {loading ? (
                    <span className="loader"></span>
                  ) : (
                    <>
                      <IoSearch size={20} />
                      <span className="uppercase font-medium text-sm">
                        Search
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <button
              className="flex items-center w-full py-1 xl:hidden"
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
          <div className="  w-full  md:grid xl:grid-cols-3 md:grid-cols-2 flex-col  gap-5 py-4 lg:px-0 px-2">
            {roomData &&
              roomData.map((data, index) => (
                <div
                  key={index}
                  className="border 2xl:h-[75vh] lg:h-[64vh]  h-auto relative w-full rounded-md shadow flex  flex-col px-3 py-3 gap-5 "
                >
                  <div className="lg:w-100%] w-full">
                    <img
                      src={`http://127.0.0.1:8000${data.room_data?.images[0]?.room_image}`} // Ensure this URL is correct
                      alt="" // Consider adding a descriptive alt text for accessibility
                      className="rounded w-full h-[230px]" // Tailwind CSS classes for styling
                    />
                  </div>

                  <div className="flex flex-col gap-2 ">
                    <h3 className="text-lg font-semibold">
                      {data.room_data.room_type}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <p className="bg-gray-200 px-2 py-1 text-sm rounded-lg">
                        max. guests : {data.room_data.room_people} adults
                      </p>
                      <p className="bg-gray-200 px-2 py-1 text-sm rounded-lg">
                        bed type :{data.room_data.bed_type}
                      </p>
                      <p className="bg-gray-200 px-2 py-1 text-sm rounded-lg">
                        size : {data.room_data.size} m²
                      </p>
                    </div>

                    <div className="flex gap-4 items-center mt-2">
                      {data.room_data?.features
                        ?.slice(0, 3)
                        .map((feature, index) => (
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
                      Avaibale Room : {data.available_rooms}{" "}
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
                    <div className="w-full flex items-start   flex-col gap-2">
                      <p className="font-semibold">
                        {data.room_data?.price} BDT /
                        <span className="text-sm text-gray-500">night</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePrebooked(data)}
                    className=" md:w-[96%] md:absolute bottom-3 left-2 bg-[#795f9e] text-white px-5  py-1 rounded-lg text-lg"
                  >
                    Book Now
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default AddReservation;

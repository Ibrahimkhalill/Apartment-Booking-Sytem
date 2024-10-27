import { useLocation, useNavigate } from "react-router-dom";
import Carousel from "../component/Carousel";
import { useState, useEffect } from "react";
import CustomBookingDatePicker from "../component/CustomBookingDatePicker";
import { IoSearch } from "react-icons/io5";
import { RiCloseLargeFill } from "react-icons/ri";
import axiosInstance from "../component/axioxinstance";
import { useSelector } from "react-redux";
import { handleSetData } from "../component/Cookies";

function Home() {
  const checkInDate = useSelector((state) => state.booking.checkInDate);
  const checkOutDate = useSelector((state) => state.booking.checkOutDate);
  const rooms = useSelector((state) => state.booking.rooms);
  const totalAdults = rooms?.reduce((sum, room) => sum + room.adults, 0);
  const [searchVisible, setSearchVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const navigate = useNavigate();

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
      setLoading(true);
      const response = await axiosInstance.post("/api/search/available/room/", {
        checkInDate: checkInDate?.format("YYYY-MM-DD"),
        checkOutDate: checkOutDate?.format("YYYY-MM-DD"),
        room_quantity: rooms.length,
        rooms: rooms,
      });

      if (response.status === 200) {
        navigate(`/available_room?${queryString}`, {
          state: {
            data: response.data,
            adults: totalAdults,
          },
        });
        handleSetData({ checkInDate, checkOutDate, rooms });
        setLoading(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setLoading(false);
        navigate(`/available_room?${queryString}`);
        handleSetData({ checkInDate, checkOutDate, rooms });
        // Show the error message to the user
      } else {
        console.error("An error occurred:", error.message);
        alert("An error occurred while checking room availability.");
        setLoading(false);
      }
    }
  };
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      if (!sessionStorage.getItem("reloaded")) {
        sessionStorage.setItem("reloaded", "true");
        window.location.reload();
      }
    }
  }, [location]);

  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/get-all-images/");
        setImages(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  const fetchDisplaySlider = async () => {
    try {
      const response = await axiosInstance.get("/api/get/display-slider/");
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDisplaySlider();
  }, []);

  return (
    <main className="w-full pb-10">
      <div className="w-full flex flex-col  items-center justify-center">
        <div className="bg-[#000000c7] w-full  flex flex-col items-center justify-center  px-4 py-3   ">
          <div className=" w-full   sm:w-auto border bg-white  border-[#795f9e] md:px-3 pl-3 pr-1 md:rounded-lg rounded-3xl">
            <div className="md:flex hidden flex-row  md:gap-3 gap-4 items-center justify-center">
              <CustomBookingDatePicker />

              <div className=" flex flex-col gap-3 md:w-auto w-full">
                <button
                  className="bg-[#795f9e] text-white w-full py-3 px-20 shadow-md border border-[#795f9e] flex items-center gap-1 justify-center  rounded-3xl"
                  type="submit"
                  onClick={handleSearch}
                >
                  {loading ? (
                    <span className="loader"></span>
                  ) : (
                    <>
                      <IoSearch size={25} />
                      <span className="uppercase font-medium text-base">
                        Search
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
        <div className="w-full relative ">
          <Carousel data={data} />
        </div>
        <div className="flex md:flex-row flex-col items-center w-full px-5 mt-10 gap-5">
          <div className="bg-slate-800 md:w-[60%] md:h-[50vh] flex flex-col md:gap-7 gap-4 md:items-start items-center justify-center px-5 py-4">
            <h1 className="text-white md:text-4xl text-2xl font-bold">
              Basundara Apartment
            </h1>
            <p
              className="text-white  md:text-xl font-bold "
              style={{ fontStyle: "italic" }}
            >
              Welcomes you to the city of the great saint Hazrat Shahjalal.
            </p>
            <p className="text-white md:text-base text-sm font-medium md:text-left text-center">
              Situated at the heart of the city and very close to most of the
              local attractions, we offer you to enjoy warm hospitality, and
              comfort for your business and leisure needs. Our newly established
              property is designed to keep you pleased from the moment you step
              in.
            </p>
          </div>
          <div className="bg-gray-100 md:w-[40%] md:h-[50vh]">
            <img
              src="https://www.belgicafurniture.com/images/collections/3245_large.jpg"
              alt=""
              className="w-full h-full"
            />
          </div>
        </div>
        <div className="w-full py-10 px-5 ">
          <h1 className="md:text-4xl text-2xl font-semibold text-center border-b pb-5">
            Our Gallery
          </h1>

          <div className="grid xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 gap-2 py-5 ">
            {images.slice(0, 8).map((data, index) => (
              <div key={index} className="h-[300px] overflow-hidden">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${data.room_image}`}
                  alt=""
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
                />
              </div>
            ))}
          </div>
          {/* <div className="flex flex-col gap-2 w-full">
              {images.slice(1, 3).map((data, index) => (
                <div key={index} className="h-[200px] ">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}${data.room_image}`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            {images.slice(4, 5).map((data, index) => (
              <div key={index} className="h-[410px] ">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${data.room_image}`}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
            <div className="flex flex-col gap-2 w-full">
              {images.slice(6, 8).map((data, index) => (
                <div key={index} className="h-[200px] ">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}${data.room_image}`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 py-5">
            {images.slice(9).map((data, index) => (
              <div key={index} className="h-[410px] ">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${data.room_image}`}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div> */}
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
    </main>
  );
}

export default Home;

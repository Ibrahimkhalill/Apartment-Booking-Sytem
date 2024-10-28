import { Link, useNavigate } from "react-router-dom";
import roomVideo from "../assets/video/room.mp4";
import { useEffect, useState } from "react";
import axiosInstance from "../component/axioxinstance";
import Loading from "../component/Loading";

import { IoSearch } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";

import BookNowDateCheacking from "../component/BookNowDateCheacking";
import { useSelector } from "react-redux";
import MessagesModal from "../component/MessagesModal";
const Room = () => {
  const [room, setRoom] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesmodalVisible, setMessgesModalVisible] = useState(false);
  const [messges, setMessges] = useState("");
  const checkInDate = useSelector((state) => state.booking.checkInDate);
  const checkOutDate = useSelector((state) => state.booking.checkOutDate);
  const rooms = useSelector((state) => state.booking.rooms);
  const [booknowVisible, setBookNowVisible] = useState(false);
  const totalAdults = rooms?.reduce((sum, room) => sum + room.adults, 0);
  const [roomId, setRomId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchdata = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/get_room/");
        if (response.status === 200) {
          setRoom(response.data);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchdata();
  }, []);
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
        `/api/search/available/room/${roomId}/`,
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

  useEffect(() => {
    console.log("kjfds", booknowVisible);

    document.body.style.overflow = booknowVisible ? "hidden" : "auto";

    return () => {
      // Cleanup overflow style on modal close
      document.body.style.overflow = "auto";
    };
  }, [booknowVisible]);

  return (
    <div className="flex relative items-center flex-col">
      <div className="w-full md:h-[80vh] h-[50vh] relative">
        <video
          src={roomVideo}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        ></video>

        <div className="mask h-full "></div>
        <div className="absolute top-1/2 w-full left-1/2 -translate-x-1/2 -translate-y-1/2 z flex flex-col gap-4 items-center justify-center">
          <h1 className="text-white sm:text-5xl text-3xl font-medium uppercase">
            Our Room
          </h1>
          <p className="text-white text-center">
            Rest & Relaxation Await: Explore Our Rooms
          </p>
        </div>
      </div>
      <div className="md:max-w-[80%] px-4 my-10">
        <div className="tracking-wider leading-7">
          Come and experience what our guests talk widely about – splendid
          feelings of staying very close to the backwater and far from the
          chaos! We have all the facilities and arrangements to meet the needs
          of all type of guest. With 45 superbly appointed rooms, Hotel Grand
          Park offers a mix of Premium Single, Premium Deluxe, Superior Twin and
          Park Suites. Bedrooms are elegant, spacious and bright in style and
          have been designed with guests comfort in mind.
        </div>
        {loading
          ? Array.from({ length: 4 }, (_, index) => (
              <Loading key={index} index={index} />
            ))
          : room &&
            room.map((data, index) => (
              <div
                key={index}
                className={`${
                  (index + 1) % 2 === 0
                    ? "flex flex-col lg:flex-row-reverse my-14 w-full gap-10 items-start"
                    : "flex lg:flex-row flex-col my-14 w-full gap-10 items-start"
                }`}
              >
                <div className="xl:h-[50vh] md:h-[30vh] lg:w-[50%] w-full overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}${
                      data.images[0]?.room_image
                    }`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 ease-in-out rounded-md"
                    alt="Zoom on hover"
                  />
                </div>
                <div className="flex flex-col gap-5 lg:w-[50%] w-full">
                  <h1 className="text-3xl font-medium">{data.room_type}</h1>
                  <p className="tracking-wide leading-7">
                    {data.room_description}
                  </p>
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/room/room-details/${data.room_type}`}
                      className="text-textColor flex items-start py-3 underline font-medium rounded-lg"
                    >
                      Discover More
                    </Link>
                    <button
                      onClick={() => {
                        setBookNowVisible(true);
                        setRomId(data.id);
                      }}
                      className="text-textColor flex items-start py-3 underline font-medium rounded-lg"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>
      {booknowVisible && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-slate-800 opacity-80 z-40"></div>

          {/* Modal */}
          <div className=" duration-500 ease-in-out transition-transform shadow-custom xl:w-[61%] md:w-[95%] overflow-hidden w-full fixed md:h-auto h-screen z-50 xl:top-16 md:top-28 top-0 left-1/2 -translate-x-1/2 border bg-white  md:border-[#795f9e] md:px-6 md:py-5 pl-3 pr-3 md:rounded-lg ">
            <div className="py-4 flex items-center justify-between">
              <h1 className="text-2xl font-medium">Choose dates</h1>
              <button onClick={() => setBookNowVisible(false)}>
                <IoCloseSharp size={30} />
              </button>
            </div>

            <div className="flex  flex-row md:gap-3 gap-4 items-center justify-center">
              <BookNowDateCheacking />
            </div>

            <div className="float-right my-3 md:w-auto w-full">
              <button
                onClick={handleSearch}
                className="bg-textColor md:w-auto w-full py-3 px-10 text-white rounded-full"
              >
                Book
              </button>
            </div>
          </div>
        </>
      )}
      {messagesmodalVisible && (
        <MessagesModal
          setMessgesModalVisible={setMessgesModalVisible}
          messagesmodalVisible={messagesmodalVisible}
          data={messges}
        />
      )}
    </div>
  );
};

export default Room;

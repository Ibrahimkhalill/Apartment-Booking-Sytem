import { Link } from "react-router-dom";
import roomVideo from "/video/room.mp4";
import { useEffect, useState } from "react";
import axiosInstance from "../component/axioxinstance";
import Loading from "../component/Loading";
const Room = () => {
  const [room, setRoom] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/get_room/");
        if (response.status === 200) {
          setRoom(response.data);
          setInterval(() => {
            setLoading(false);
          }, 1000);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchdata();
  }, []);
  console.log(import.meta.env.VITE_BASE_URL);

  return (
    <div className="flex items-center flex-col">
      <div className="w-full md:h-[80vh] h-[50vh] relative">
        <video
          src={roomVideo}
          autoPlay
          muted
          loop
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
      <div className="max-w-[80%] my-10">
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
                    ? "flex flex-col lg:flex-row-reverse my-14 w-full gap-10 items-center"
                    : "flex lg:flex-row flex-col my-14 w-full gap-10 items-center"
                }`}
              >
                <div className="h-[50vh] lg:w-[50%] w-full overflow-hidden">
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
                  <div>
                    <Link
                      to={`/room/room-details/${data.room_type}`}
                      className="text-textColor flex items-start py-3 underline font-medium rounded-lg"
                    >
                      Discover More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Room;

import { useEffect, useState } from "react";
import axiosInstance from "../component/axioxinstance";
import { useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const RoomDeatils = () => {
  const { id } = useParams();
  const [currentSlide, setCurrentSlide] = useState(1);
  const [animation, setAnimation] = useState(false);
  const [data, setData] = useState({});
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
      </div>

      <div className="md:max-w-[80%] md:mx-0 mx-3 my-10">
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
    </div>
  );
};

export default RoomDeatils;

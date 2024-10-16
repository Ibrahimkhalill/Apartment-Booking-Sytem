/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { RiCloseLargeFill } from "react-icons/ri";

const CustomModalRoom = ({ modalVisible, setModalVisible, data, modalRef }) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [animation, setAnimation] = useState(false);
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === data?.images?.length ? 1 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 1 ? data?.images?.length : prev - 1));
  };
  const handleFalse = () => {
    setAnimation(true); // Trigger the animation (start zoom out)

    const timeoutId = setTimeout(() => {
      setAnimation(false);
      setModalVisible(false);
    }, 100); // Delay matches the animation duration (1 second)

    // Cleanup function to clear the timeout when unmounted or modal is closed
    return () => clearTimeout(timeoutId);
  };

  useEffect(() => {
    document.body.style.overflow = modalVisible ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalVisible]);


  useEffect(() => {
    // Function to handle click outside
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleFalse(); // Close the element
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef]);

  if (!modalVisible) return null; // Return null if modal is not visible

  return (
    <>
      <div className="fixed   inset-0 z-50 flex items-center lg:justify-center justify-start bg-black bg-opacity-90 ">
        {/* Modal Content */}
        <div
          ref={modalRef}
          className={`${
            !animation ? "MessagesModalAnimationDown" : "MessagesModalAnimationUp"
          }  relative bg-white md:rounded-lg lg:pl-10 lg:px-2 lg:py-10 z-50 w-full lg:w-[1000px] md:h-auto h-full overflow-y-auto`}
        >
          <div className="py-7 md:py-0 relative">
            <button className="top-4 md:top-0 right-5 absolute">
              <RiCloseLargeFill size={28} onClick={() => handleFalse()} />
            </button>
          </div>

          <div className="flex lg:flex-row flex-col gap-5  ">
            {/* Left Side: Image Slider */}

            <div className="lg:w-[60%] w-full flex flex-col gap-4 md:border-0 border-b border-gray-400 pb-3">
              <div className="lg:h-[50vh] w-full">
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
              <div className="w-full flex items-center justify-between lg:justify-end gap-3 px-10">
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
            {/* Right Side: Room Details */}
            <div className="lg:w-[40%] lg:h-[60vh] overflow-y-auto custom-scrollbar lg:px-0 px-5">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold">{data?.room_type}</h3>
                <div className="lg:w-[90%] w-full flex flex-col gap-2">
                  <div className="flex flex-wrap gap-3">
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
                  <div className="text-lg">{data?.room_description}</div>
                  <div>
                    <h1 className="font-medium text-[1.1rem]">Room features</h1>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {data?.features?.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col items-center justify-center text-center text-sm mt-4"
                        >
                          <img
                            src={`http://127.0.0.1:8000${item.feature_images}`}
                            alt=""
                            width={25}
                          />
                          <div className="h-10">{item?.feature_name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomModalRoom;

import React, { useEffect, useState } from "react";
import { TfiArrowCircleRight } from "react-icons/tfi";
import { TfiArrowCircleLeft } from "react-icons/tfi";

const Carousel = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === data.length - 1 ? 0 : prevIndex + 1
      );
      setIsAnimating(false);
    }, 300); // Match duration of transition
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? data.length - 1 : prevIndex - 1
      );
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative h-[50vh] md:h-[80vh] flex">
        {data.map((item, index) => {
          const isPrev =
            index === (currentIndex === 0 ? data.length - 1 : currentIndex - 1);
          const isNext =
            index === (currentIndex === data.length - 1 ? 0 : currentIndex + 1);

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-all  duration-1000 ease-in-out transform ${
                index === currentIndex
                  ? "translate-x-0 opacity-100 z-10"
                  : isPrev
                  ? "-translate-x-full opacity-100 z-0" // Make the previous slide visible while sliding
                  : isNext
                  ? "translate-x-full opacity-100 z-0" // Make the next slide come from the right
                  : "translate-x-full opacity-0"
              }`}
            >
              <img
                src={`${import.meta.env.VITE_BASE_URL}${item.slider_image}`}
                alt={item.name}
                className="block w-full h-full object-cover"
              />
              <div className="absolute w-full flex flex-col items-center justify-center z-30 text-center px-2 text-white top-1/2 -translate-y-1/2">
                <h2 className="md:text-5xl text-3xl font-bold md:w-[35vw]">{item.name}</h2>
                <p className="py-3 md:text-lg md:w-[40vw]">{item.description}</p>
                <button className="bg-[#795f9e] md:text-base text-sm px-10 py-3 text-white rounded-3xl  md:w-auto uppercase font-medium">
                  {item.button_name}
                </button>
              </div>
              <div className="mask"></div>
            </div>
          );
        })}
      </div>

      <div className="absolute z-30 flex space-x-3 bottom-5 left-1/2 transform -translate-x-1/2">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-300 hover:bg-white"
            }`}
          ></button>
        ))}
      </div>

      {/* Prev/Next Buttons */}
      <button
        onClick={handlePrev}
        className="md:block hidden absolute top-1/2 left-5 transform -translate-y-1/2 px-4 py-2  bg-opacity-70 text-white rounded-full z-40" // Ensure high z-index
      >
        <TfiArrowCircleLeft size={35} className="hover:bg-slate-800 rounded-full"/> {/* Adjust size if needed */}
      </button>
      <button
        onClick={handleNext}
        className=" md:block hidden  absolute top-1/2 right-5 transform -translate-y-1/2 px-4 py-2  bg-opacity-70 text-white rounded-full z-40" // Ensure high z-index
      >
        <TfiArrowCircleRight size={35} className="hover:bg-slate-800 rounded-full"/> {/* Adjust size if needed */}
      </button>
    </div>
  );
};

export default Carousel;

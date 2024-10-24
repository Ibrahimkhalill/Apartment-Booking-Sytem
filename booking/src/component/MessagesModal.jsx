/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiError } from "react-icons/bi";

const MessagesModal = ({
  messagesmodalVisible,
  setMessgesModalVisible,
  data,
  prebookingId,
  nevigate,
  error,
  setError,
}) => {
  const [animation, setAnimation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = messagesmodalVisible ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [messagesmodalVisible]);

  const handleFalse = () => {
    setAnimation(true); // Trigger the animation (start zoom out)

    const timeoutId = setTimeout(() => {
      setAnimation(false);
      if (prebookingId) {
        if (nevigate == -1) {
          navigate(-1);
          setError(false);
        } else {
          window.location.href = nevigate;
          setError(false);
        }
      }
      setMessgesModalVisible(false);
    }, 100); // Delay matches the animation duration (1 second)

    // Cleanup function to clear the timeout when unmounted or modal is closed
    return () => clearTimeout(timeoutId);
  };

  if (!messagesmodalVisible) return null; // Return null if modal is not visible

  return (
    <>
      <div className="fixed   inset-0 z-50 flex items-start lg:justify-center justify-start bg-black bg-opacity-90  ">
        {/* Modal Content */}

        <div
          className={`${
            !animation
              ? "MessagesModalAnimationDown "
              : "MessagesModalAnimationUp"
          }  relative  md:rounded-md lg:pl-10 lg:px-2 lg:py-10 my-10 w-full lg:w-[1000px] md:h-auto h-full overflow-y-auto`}
        >
          {prebookingId &&
            (data != "Prebooking not found")&&(
              <div className="absolute top-[5px] text-white text-xl font-medium">
                Your session has expired.
              </div>
            )}

          <div className="w-full flex flex-col items-center justify-center gap-5 bg-white py-14 rounded">
            {data == "Prebooking not found" && (
              <BiError size={80} className="text-red-700" />
            )}
            <div className="font-medium text-lg w-[50%] text-center">
              {data}
            </div>
            {!prebookingId && (
              <div>Please try another room or search another dates.</div>
            )}
            <button
              className="bg-red-700 px-10 py-3 text-sm text-white rounded-lg uppercase"
              onClick={handleFalse}
            >
              Start A New Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessagesModal;

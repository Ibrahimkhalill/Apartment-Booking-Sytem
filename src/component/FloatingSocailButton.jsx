import { useState } from "react";
import { MdMessage } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const FloatingSocailButton = () => {
  const [buttonVisible, setbuttonVisible] = useState(false);
  const openMessenger = () => {
    const messengerAppUrl = "fb-messenger://user-thread/YOUR_USER_ID";
    const messengerWebUrl = "https://m.me/ibrahim";

    // Try to open the Messenger app
    window.location.href = messengerAppUrl;

    // Fallback to Messenger web URL after a short delay
    setTimeout(() => {
      window.location.href = messengerWebUrl;
    }, 500);
  };

  const openGmail = () => {
    const email = "hijabpoint374@gmail.com"; // Replace with your desired email
    const subject = "write your subject"; // Replace with your desired subject
    const body = ""; // Replace with your desired body content

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };
  const openCall = () => {
    window.location.href = "tel:+8801746185116";
  };

  const openWhatsApp = () => {
    const phoneNumber = "+88101746185116"; // Replace with the recipient's phone number (include country code without +)
    const message = ""; // Replace with your desired message
    const encodedMessage = encodeURIComponent(message);

    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    window.open(whatsappLink, "_blank");
  };
  return (
    <div className="fixed right-7 bottom-5 z-40 ">
      {buttonVisible && (
        <div className="flex flex-col items-center animate-slide-up">
          <button
            onClick={openCall}
            className=" w-14 h-14 mb-3 rounded-full flex items-center justify-center"
            title="Phone"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/724/724664.png"
              alt=""
            />
          </button>
          <button
            onClick={openWhatsApp}
            title="Whatsup"
            className="w-14 h-14 mb-3 rounded-full flex items-center justify-center"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/4494/4494494.png"
              alt=""
            />
          </button>
          <button
            onClick={openMessenger}
            title="Messenger"
            className=" w-14 h-14 mb-3 rounded-full flex items-center justify-center"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/3670/3670042.png"
              alt=""
            />
          </button>
          <button
            onClick={openGmail}
            title="Email"
            className="bg-red-500 w-14 h-14 mb-3 rounded-full flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="70%"
              height="70%"
              viewBox="0 0 48 48"
            >
              <path
                fill="#e0e0e0"
                d="M5.5,40.5h37c1.933,0,3.5-1.567,3.5-3.5V11c0-1.933-1.567-3.5-3.5-3.5h-37C3.567,7.5,2,9.067,2,11v26C2,38.933,3.567,40.5,5.5,40.5z"
              ></path>
              <path
                fill="#d9d9d9"
                d="M26,40.5h16.5c1.933,0,3.5-1.567,3.5-3.5V11c0-1.933-1.567-3.5-3.5-3.5h-37C3.567,7.5,2,9.067,2,11L26,40.5z"
              ></path>
              <path
                fill="#eee"
                d="M6.745,40.5H42.5c1.933,0,3.5-1.567,3.5-3.5V11.5L6.745,40.5z"
              ></path>
              <path
                fill="#e0e0e0"
                d="M25.745,40.5H42.5c1.933,0,3.5-1.567,3.5-3.5V11.5L18.771,31.616L25.745,40.5z"
              ></path>
              <path
                fill="#ca3737"
                d="M42.5,9.5h-37C3.567,9.5,2,9.067,2,11v26c0,1.933,1.567,3.5,3.5,3.5H7V12h34v28.5h1.5c1.933,0,3.5-1.567,3.5-3.5V11C46,9.067,44.433,9.5,42.5,9.5z"
              ></path>
              <path
                fill="#f5f5f5"
                d="M42.5,7.5H24H5.5C3.567,7.5,2,9.036,2,11c0,1.206,1.518,2.258,1.518,2.258L24,27.756l20.482-14.497c0,0,1.518-1.053,1.518-2.258C46,9.036,44.433,7.5,42.5,7.5z"
              ></path>
              <path
                fill="#e84f4b"
                d="M43.246,7.582L24,21L4.754,7.582C3.18,7.919,2,9.297,2,11c0,1.206,1.518,2.258,1.518,2.258L24,27.756l20.482-14.497c0,0,1.518-1.053,1.518-2.258C46,9.297,44.82,7.919,43.246,7.582z"
              ></path>
            </svg>
          </button>
        </div>
      )}

      <button
        onClick={() => setbuttonVisible(!buttonVisible)}
        className={`bg-textColor w-14 h-14 mb-3 rounded-full flex items-center justify-center transition-transform duration-300 ${
          buttonVisible ? "rotate-180" : "rotate-0"
        }`}
      >
        {buttonVisible ? (
          <IoMdClose size={35} color="white" title="hide" />
        ) : (
          <MdMessage size={35} color="white" />
        )}
      </button>
    </div>
  );
};

export default FloatingSocailButton;

import { Link } from "react-router-dom";
import Sidebar from "../../component/admin/Sidebar";

const Confirmation = () => {
  return (
    <Sidebar>
      <main className="conatiner m-auto py-10 sm:px-0 px-2">
        <div className="w-full h-full flex items-center justify-center">
          <div className="bg-gray-200 py-10 px-10 border shadow-small rounded-lg flex items-center flex-col gap-3">
            <div>
              <img src={"/images/success.png"} width={50} alt="" />
            </div>
            <div className="text-lg font-semibold text-center">
              Your Booking Has Been Confirmed !
            </div>
            <div className="text-textColor font-medium text-center">
              Thank you for your Reservation
            </div>

            <div className="email_sent_order_confirm text-center">
              We will send Booking confirmation email with details of your
              reservation
            </div>
            <a href={"https://mail.google.com/"}>
              <button className="bg-textColor  border border-textColor py-3 px-10 text-white rounded-3xl">
                Go to Email{" "}
              </button>
            </a>
          </div>
        </div>
      </main>
    </Sidebar>
  );
};

export default Confirmation;

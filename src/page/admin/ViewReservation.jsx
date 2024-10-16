import { useEffect, useState } from "react";
import Sidebar from "../../component/admin/Sidebar";
import axiosInstance from "../../component/axioxinstance";
import { RxUpdate } from "react-icons/rx";

const ViewReservation = () => {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState();
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [reservationDeatils, setReservationDetails] = useState({});

  const [is_check_in, setIsCheckIn] = useState(false);
  const [is_check_out, setIsCheckOut] = useState(false);
  const fetchdata = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("api/get/reservation/");
      if (response.status === 200) {
        setData(response.data);
        setFilterData(response.data);
        setTimeout(() => {
          setLoading(false);
        }, 1000); // Delay for user experience
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);
  console.log(data);

  // Handle viewing reservation details
  const handleviewDeatils = (item) => {
    if (
      Object.keys(reservationDeatils).length !== 0 &&
      reservationDeatils.id === item.id
    ) {
      // If currently viewing the same reservation, clear it
      setReservationDetails({});
    } else {
      // Otherwise, set the selected reservation details
      setReservationDetails(item);
      setIsCheckIn(item.is_check_in);
      setIsCheckOut(item.is_check_out);
    }
  };

  const updateReservation = async (reservationId) => {
    try {
      const response = await axiosInstance.put(
        `/api/upadte_reservation/${reservationId}/`,
        {
          is_check_in: is_check_in,
          is_check_out: is_check_out,
        }
      );

      // Handle the response from the server
      if (response.status === 200) {
        fetchdata();
        alert("Reservation updated successfully:", response.data.message);
      }
    } catch (error) {
      // Handle errors
      if (error.response) {
        console.error("Error updating reservation:", error.response.data.error);
        alert(error.response.data.error); // Show an alert for the error
      } else {
        console.error("Error updating reservation:", error.message);
        alert("An error occurred while updating the reservation.");
      }
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase(); // Convert the input to lowercase
    setSearchValue(searchValue);
    const filteredData = filterData.filter(
      (item) => item.confirmation_number.toLowerCase().includes(searchValue) // Compare in lowercase
    );
    // Assuming you have a state to hold the filtered results
    setData(filteredData); // Update the state with filtered results
  };

  return (
    <Sidebar>
      <div className="w-full flex flex-col items-center justify-center gap-5">
        <div className="text-2xl font-medium">
          {reservationDeatils && Object.keys(reservationDeatils).length !== 0
            ? "Reservation Details"
            : "View Reservation"}
        </div>

        <div className="w-full flex items-center justify-between">
          {reservationDeatils &&
          Object.keys(reservationDeatils).length !== 0 ? (
            <div>
              <button
                className="bg-textColor px-5 py-1 text-white rounded"
                onClick={() => {
                  setReservationDetails({});
                  setIsCheckIn(false);
                  setIsCheckOut(false);
                }} // Reset details on back button click
              >
                Back
              </button>
            </div>
          ) : (
            <input
              type="text"
              placeholder="Search booking number"
              className="sm:w-[30%] w-full py-2 rounded-md border-slate-300"
              onChange={handleSearch}
              value={searchValue}
            />
          )}
        </div>

        <div className="relative shadow-md sm:rounded-lg w-full">
          {reservationDeatils &&
          Object.keys(reservationDeatils).length !== 0 ? (
            <>
              <div className="relative overflow-x-auto  shadow-md sm:rounded-lg w-full">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="p-4">
                        Serial
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Room No
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Room Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Adults
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3">
                        IS Check In
                      </th>
                      <th scope="col" className="px-6 py-3">
                        IS Check Out
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Arrival
                      </th>

                      <th scope="col" className="px-6 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-6 py-4">1</td>
                      <td className="px-6 py-4">
                        {reservationDeatils.room_no?.room_no}
                      </td>
                      <td className="px-6 py-4">
                        {reservationDeatils.room_no?.room_type}
                      </td>
                      <td className="px-6 py-4">
                        {reservationDeatils.room_quantity}
                      </td>
                      <td className="px-6 py-4">{reservationDeatils.adults}</td>
                      <td className="px-6 py-4">{reservationDeatils.amount}</td>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={is_check_in}
                          onChange={(event) =>
                            setIsCheckIn(event.target.checked)
                          }
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={is_check_out}
                          onChange={(event) =>
                            setIsCheckOut(event.target.checked)
                          }
                        />
                      </td>
                      <td className="px-6 py-4">
                        {reservationDeatils.arrival_time || "None"}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            updateReservation(reservationDeatils.id)
                          }
                          className="font-medium  flex  items-center bg-textColor text-white px-3 py-2 justify-center gap-1 border rounded-md"
                        >
                          <RxUpdate size={18} /> Update
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="py-3 flex flex-col items-start px-2 gap-2 w-full">
                <div className=" flex sm:flex-row flex-col items-center gap-3 w-full">
                  <div className="flex flex-col gap-2 sm:w-[40%]">
                    <h2 className="font-medium">Room Image</h2>
                    <div className="border rounded h-[230px]">
                      <img
                        src={`${import.meta.env.VITE_BASE_URL}${
                          reservationDeatils.room_no?.images[0]?.room_image
                        }`}
                        alt=""
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  </div>
                  <div className=" sm:w-[60%] w-full flex flex-col gap-2">
                    <h2 className="font-medium">Special Request</h2>
                    <div className="border rounded h-[230px] flex items-center justify-center">
                      {" "}
                      {reservationDeatils.special_request || "None"}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="relative overflow-x-auto sm:max-h-[70vh] shadow-md sm:rounded-lg w-full">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="p-4">
                      Serial
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Booking No
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Address
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Check In
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Check Out
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      onClick={() => handleviewDeatils(item)} // Corrected event handler
                      key={index}
                      className="bg-white border-b cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{item.confirmation_number}</td>
                      <td className="px-6 py-4">{item.name}</td>
                      <td className="px-6 py-4">{item.phone_number}</td>
                      <td className="px-6 py-4">{item.email}</td>
                      <td className="px-6 py-4">{item.address}</td>
                      <td className="px-6 py-4">{item.check_in_date}</td>
                      <td className="px-6 py-4">{item.check_out_date}</td>
                      <td className="px-5 py-4">
                        <button
                          title="Delete"
                          className="font-medium ml-4 text-blue-600 dark:text-blue-500 hover:underline h-[30px]"
                        >
                          <img
                            src="https://cdn-icons-png.freepik.com/256/4980/4980658.png?ga=GA1.1.590555594.1724764416&semt=ais_hybrid"
                            alt=""
                            className="h-full"
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default ViewReservation;

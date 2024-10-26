import { useEffect, useState } from "react";
import Sidebar from "../../component/admin/Sidebar";
import axiosInstance from "../../component/axioxinstance";
import { RxUpdate } from "react-icons/rx";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ViewRoom = () => {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState();
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [reservationDeatils, setReservationDetails] = useState({});
  const [roomFeature, setRoomFeature] = useState([]);
  const [roomImage, setRoomImage] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const navigate = useNavigate();
  const fetchdata = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/get_room/");
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

  // Handle viewing reservation details
  const handleviewDeatils = (item) => {
    if (
      Object.keys(reservationDeatils).length !== 0 &&
      reservationDeatils.id === item.id
    ) {
      // If currently viewing the same reservation, clear it
      setReservationDetails({});
      setRoomFeature([]);
      setRoomImage([]);
      setRoomId(null);
    } else {
      // Otherwise, set the selected reservation details
      setReservationDetails(item);
      setRoomFeature(item.features);
      setRoomImage(item.images);
      setRoomId(item.id);
    }
  };

  const handleDeleteRoom = async (featureId) => {
    const confirmation = window.confirm("Are you sure delete this row");
    if (!confirmation) {
      return;
    }
    try {
      const response = await axiosInstance.delete(
        `/api/delete/room/${featureId}/`
      );

      // Handle the response from the server
      if (response.status === 200) {
        fetchdata();
        setReservationDetails({});
        alert(response.data.message);
      }
    } catch (error) {
      // Handle errors

      console.error("Error updating featureName:", error.message);
      alert("An error occurred while delete the displayslider.");
    }
  };

  const handleDeleteRoomFeature = async (roomId, featureId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this Image?"
    );
    if (!confirmation) {
      return;
    }

    try {
      const response = await axiosInstance.delete(
        `/api/delete/room/${roomId}/feature/${featureId}/`
      );

      // Handle the response from the server
      if (response.status === 200) {
        // Filter out the deleted feature from the features list
        const updatedFeatures = roomFeature?.filter(
          (item) => item.id != featureId // Only keep features that are not the deleted one
        );
        // Update state with the new features list
        setRoomFeature(updatedFeatures);
        alert(response.data.message); // Show success message
      }
    } catch (error) {
      // Handle errors
      console.error("Error deleting feature:", error.message);
      alert("An error occurred while deleting the feature.");
    }
  };

  const handleDeleteRoomImage = async (image_id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this feature?"
    );
    if (!confirmation) {
      return;
    }

    try {
      const response = await axiosInstance.delete(
        `/api/delete/room/image/${image_id}/`
      );

      // Handle the response from the server
      if (response.status === 200) {
        // Filter out the deleted feature from the features list
        const updatedImages = reservationDeatils.images?.filter(
          (item) => item.id != image_id // Only keep features that are not the deleted one
        );
        // Update state with the new features list
        setRoomImage(updatedImages);
        alert(response.data.message); // Show success message
      }
    } catch (error) {
      // Handle errors
      console.error("Error deleting feature:", error.message);
      alert("An error occurred while deleting the feature.");
    }
  };
  console.log("reservationDeatils", reservationDeatils, roomFeature);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase(); // Convert the input to lowercase
    setSearchValue(searchValue);
    const filteredData = filterData.filter(
      (item) => item.room_type.toLowerCase().includes(searchValue) // Compare in lowercase
    );
    // Assuming you have a state to hold the filtered results
    setData(filteredData); // Update the state with filtered results
  };

  const handleNevigate = (id) => {
    navigate(`/admin/edit/room/${id}`);
  };

  return (
    <Sidebar>
      <div className="w-full flex flex-col items-center justify-center gap-5">
        <div className="text-2xl font-medium">
          {reservationDeatils && Object.keys(reservationDeatils).length !== 0
            ? "Room Details"
            : "View Room"}
        </div>

        <div className="w-full flex items-center justify-between">
          {reservationDeatils &&
          Object.keys(reservationDeatils).length !== 0 ? (
            <div>
              <button
                className="bg-textColor px-5 py-1 text-white rounded"
                onClick={() => {
                  setReservationDetails({});
                }} // Reset details on back button click
              >
                Back
              </button>
            </div>
          ) : (
            <>
              <div className="sm:w-[30%] bg-white flex items-center  border rounded-md">
                <div className="bg-textColor py-2 px-2 rounded-l-md text-white">
                  <IoSearch size={25} />
                </div>
                <input
                  type="text"
                  placeholder="Search room type"
                  className=" w-full py-0 rounded-md border-0 border-slate-300"
                  onChange={handleSearch}
                  value={searchValue}
                />
              </div>
            </>
          )}
        </div>

        <div className="relative  sm:rounded-lg w-full">
          {reservationDeatils &&
          Object.keys(reservationDeatils).length !== 0 ? (
            <>
              <div
                className=" flex  flex-col items-start py-2 
              gap-3 w-full"
              >
                {" "}
                <div className="relative  sm:max-h-[40vh] overflow-auto border  shadow-small sm:rounded-lg w-full">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 shadow-small border">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="p-4">
                          Serial
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Room No
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Room Type
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Bed type
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Size
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Max People
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <td className="px-6 py-4">1</td>
                        <td className="px-6 py-4">
                          {reservationDeatils.room_no}
                        </td>
                        <td className="px-6 py-4">
                          {reservationDeatils.room_type}
                        </td>
                        <td className="px-6 py-4">
                          {reservationDeatils.bed_type}
                        </td>
                        <td className="px-6 py-4">{reservationDeatils.size}</td>
                        <td className="px-6 py-4">
                          {reservationDeatils.price}
                        </td>
                        <td className="px-6 py-4">
                          {reservationDeatils.quantity}
                        </td>
                        <td className="px-6 py-4">
                          {reservationDeatils.room_people}
                        </td>
                        <td className=" py-4">
                          <button
                            className="font-medium ml-4 text-blue-600 dark:text-blue-500 hover:underline h-8"
                            title="Edit"
                            onClick={() =>
                              handleNevigate(reservationDeatils.id)
                            }
                          >
                            <img
                              src="https://cdn-icons-png.flaticon.com/128/6218/6218938.png"
                              alt=""
                              className="h-full"
                            />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteRoom(reservationDeatils.id)
                            }
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
                    </tbody>
                  </table>
                </div>
                <div className=" w-full flex flex-col gap-2">
                  <h2 className="font-medium">Room Features</h2>
                  <div className="relative  sm:max-h-[40vh] overflow-y-auto  shadow-small border sm:rounded-lg w-full">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="p-4">
                            Serial
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Feature Name
                          </th>
                          <th>Feature Image</th>

                          <th scope="col" className="px-6 py-3">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {roomFeature?.map((item, index) => (
                          <tr
                            key={index}
                            className="bg-white border-b cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                          >
                            <td className="px-6 py-4">{index + 1}</td>
                            <td className="px-6 py-4">{item.feature_name}</td>
                            <td className="md:px-6 py-4 md:h-20 h-[70px]  ">
                              <img
                                src={`${import.meta.env.VITE_BASE_URL}${
                                  item.feature_images
                                }`}
                                className="h-full md:w-auto w-full"
                                alt={item.feature_name}
                              ></img>
                            </td>

                            <td className="px-2 py-4 ">
                              <button
                                onClick={() =>
                                  handleDeleteRoomFeature(
                                    reservationDeatils.id,
                                    item.id
                                  )
                                }
                                className="font-medium ml-4 text-blue-600 dark:text-blue-500 hover:underline h-9"
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
                </div>
                <div className=" w-full flex flex-col gap-2">
                  <h2 className="font-medium">Room Images</h2>
                  <div className="relative  sm:max-h-[40vh] overflow-y-auto border  shadow-small sm:rounded-lg w-full">
                    <table className="w-full text-sm  text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 text-left">
                            Serial
                          </th>

                          <th className=" text-left"> Image</th>

                          <th scope="col" className=" md:px-6 px-3 pl-3 py-3">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {roomImage.map((item, index) => (
                          <tr
                            key={index}
                            className="bg-white border-b cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <td className="px-6 py-4">
                              Room Image {index + 1}
                            </td>

                            <td className=" py-4 h-40 ">
                              <img
                                src={`${import.meta.env.VITE_BASE_URL}${
                                  item.room_image
                                }`}
                                className="h-full md:w-[30%] object-cover"
                                alt={item.feature_name}
                              ></img>
                            </td>

                            <td className=" px-3 py-4 text-center">
                              <button
                                onClick={() => handleDeleteRoomImage(item.id)}
                                className=" font-medium ml-4 text-blue-600 dark:text-blue-500 hover:underline h-9"
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
                </div>
                <div className=" w-full flex flex-col gap-2">
                  <h2 className="font-medium">Room Description</h2>
                  <div className="border w-full py-4 px-5 rounded shadow-small">
                    {reservationDeatils.room_description}
                  </div>
                  <div></div>
                </div>

                <div className=" w-full flex flex-col gap-2">
                  <h2 className="font-medium">Room Address</h2>
                  <div className="border w-full py-4 px-5 rounded shadow-small">
                    {reservationDeatils.room_address}
                  </div>
                  <div></div>
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
                      Room No
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Room Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Bed type
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Max People
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
                      className={`${
                        roomId === item.id
                          ? "bg-textColor text-white"
                          : "bg-white"
                      }  border-b cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:bg-textColor hover:text-white dark:hover:bg-gray-600`}
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{item.room_no}</td>
                      <td className="px-6 py-4">{item.room_type}</td>
                      <td className="px-6 py-4">{item.bed_type}</td>
                      <td className="px-6 py-4">{item.size}</td>
                      <td className="px-6 py-4">{item.price}</td>
                      <td className="px-6 py-4">{item.quantity}</td>
                      <td className="px-6 py-4">{item.room_people}</td>
                      <td className=" py-4">
                        <button
                          className="font-medium ml-4 text-blue-600 dark:text-blue-500 hover:underline h-8"
                          title="Edit"
                          onClick={() => handleNevigate(item.id)}
                        >
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/6218/6218938.png"
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

export default ViewRoom;

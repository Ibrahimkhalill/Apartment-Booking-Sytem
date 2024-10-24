/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import axiosInstance from "../../component/axioxinstance";

const AddRoomSize = ({ roomSizeVisible, setRoomSizeVisible, fetchRomSize }) => {
  const [formErrors, setFormErrors] = useState({});
  const [roomSize, setRoomSize] = useState("");
  const [data, setData] = useState([]);
  const [roomSizeId, setRoomSizeId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchdata = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/get_all_size/");
      if (response.status === 200) {
        setData(response.data);
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

  // Handle viewing roomSize details
  const handleviewDeatils = (item) => {
    if (roomSizeId === item.id) {
      setRoomSize("");
      setRoomSizeId(null);
    } else {
      setRoomSizeId(item.id);
      setRoomSize(item.size);
    }
  };

  const validateRoomData = (roomSize) => {
    const errors = {};

    // Check required fields
    if (!roomSize) {
      errors.roomSize = "Room Size is required.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate room data
    const validationErrors = validateRoomData(roomSize);
    if (Object.keys(validationErrors).length > 0) {
      console.error("Validation errors:", validationErrors);
      setFormErrors(validationErrors);
      return; // Stop submission if there are errors
    }
    // Clear previous errors
    setFormErrors({});

    try {
      // Send formData directly in the Axios request
      const response = await axiosInstance.post("/api/add/room-size/", {
        roomSize: roomSize,
      });

      if (response.status === 200) {
        alert(response.data.message);
        fetchdata();
        fetchRomSize();
        setRoomSize("");
      } else {
        console.error("Error:", response);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const updateroomSize = async () => {
    try {
      const response = await axiosInstance.put(
        `/api/update/room-size/${roomSizeId}/`
      );

      // Handle the response from the server
      if (response.status === 200) {
        fetchdata();
        fetchRomSize();
        alert(response.data.message);
      }
    } catch (error) {
      // Handle errors

      console.error("Error updating RoomSize:", error.message);
      alert("An error occurred while updating the RoomSize.");
    }
  };

  const deleteroomSize = async (sliderId) => {
    const confirmation = window.confirm("Are you sure delete this row");
    if (!confirmation) {
      return;
    }
    try {
      const response = await axiosInstance.delete(
        `/api/delete/room-size/${sliderId}/`
      );

      // Handle the response from the server
      if (response.status === 200) {
        fetchdata();
        fetchRomSize();
        alert(response.data.message);
      }
    } catch (error) {
      // Handle errors

      console.error("Error updating roomSize:", error.message);
      alert("An error occurred while delete the displayslider.");
    }
  };
  return (
    <>
      <Modal
        title="Add Room Size"
        centered
        open={roomSizeVisible}
        onOk={() => {
          setRoomSizeVisible(false);
          setFormErrors({});
          setRoomSizeId(null);
          setRoomSize("");
        }}
        onCancel={() => {
          setRoomSizeVisible(false);
          setFormErrors({});
          setRoomSizeId(null);
          setRoomSize("");
        }}
        width={1000}
        footer
      >
        <div className="w-full">
          <div className="border shadow-small rounded-md  w-full py-6 flex md:flex-row flex-col md:items-center items-start justify-center gap-2 px-2">
            <div className="flex gap-2 md:items-center justify-center relative md:flex-row flex-col md:w-auto w-full ">
              <label
                htmlFor="roomName"
                className="md:w-32 font-medium text-sm text-gray-700"
              >
                Room Size*
              </label>
              <input
                type="text"
                id="roomName"
                placeholder="write your bed type "
                className={`${
                  formErrors.roomSize ? "border-red-700" : "border-slate-300"
                }  rounded-md md:w-[29.8vw] w-full`}
                onChange={(e) => {
                  setRoomSize(e.target.value);
                  formErrors.roomSize = "";
                }}
                value={roomSize}
              />
              {formErrors.roomSize && (
                <div className="absolute md:top-11 top-16 md:mt-0 mt-1 text-xs text-red-700 md:left-32 md:ml-2">
                  {formErrors.roomSize}
                </div>
              )}
            </div>
            {roomSizeId ? (
              <button
                className="bg-textColor  px-10 py-2 text-white rounded"
                onClick={updateroomSize}
              >
                Update
              </button>
            ) : (
              <button
                className="bg-textColor  px-10 py-2 text-white rounded"
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-5 my-3">
            <div className="relative overflow-x-auto sm:max-h-[30vh] border shadow-small sm:rounded-lg w-full">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs  text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Serial
                    </th>
                    <th scope="col" className=" px-6 py-3">
                      Bed Type
                    </th>

                    <th scope="col" className="px-9 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      onClick={() => handleviewDeatils(item)}
                      key={index}
                      className={`${
                        item.id == roomSizeId
                          ? " bg-textColor text-white"
                          : "bg-white"
                      }   px-3 border-b cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:bg-textColor hover:text-white dark:hover:bg-gray-600`}
                    >
                      <td className="  px-6 py-3">{index + 1}</td>
                      <td className="  px-6 py-3">{item.size}</td>

                      <td className="  px-6 py-3">
                        <button
                          onClick={() => deleteroomSize(item.id)}
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
          </div>
        </div>
      </Modal>
    </>
  );
};
export default AddRoomSize;

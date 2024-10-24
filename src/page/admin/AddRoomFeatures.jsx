/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { Button, Modal } from "antd";
import axiosInstance from "../../component/axioxinstance";

const AddRoomFeatures = ({
  featureModalVisible,
  setFeatureModalVisible,
  fetchFeatureListdata,
}) => {
  const [formErrors, setFormErrors] = useState({});
  const [featureName, setFeatureName] = useState("");
  const [featureImage, setFeatureImage] = useState("");
  const [data, setData] = useState([]);
  const [featureNameId, setFeatureNameId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState("");

  const fileInputRef = useRef(null);
  const fetchdata = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/get_feature/list/");
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

  const handleReset = () => {
    setFeatureNameId(null);
    setFeatureName("");
    setFeatureImage("");
    setImagePreviews("");
    fileInputRef.current.value = "";
  };
  // Handle viewing featureName details
  const handleviewDeatils = (item) => {
    if (featureNameId === item.id) {
      handleReset();
    } else {
      setFeatureNameId(item.id);
      setFeatureName(item.feature_name);
      setImagePreviews(
        `${import.meta.env.VITE_BASE_URL}${item.feature_images}`
      );
    }
  };

  const validateRoomData = (featureName, featureImage) => {
    const errors = {};

    // Check required fields
    if (!featureName) {
      errors.featureName = "Feature Name is required.";
    }
    if (!featureImage) {
      errors.featureImage = "Feature Image is required.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append form fields
    formData.append("featureName", featureName);
    formData.append("image", featureImage);
    // Validate room data
    const validationErrors = validateRoomData(featureName, featureImage);
    if (Object.keys(validationErrors).length > 0) {
      console.error("Validation errors:", validationErrors);
      setFormErrors(validationErrors);
      return; // Stop submission if there are errors
    }
    // Clear previous errors
    setFormErrors({});
    try {
      // Send formData directly in the Axios request
      const response = await axiosInstance.post(
        "/api/add/room-feature/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure multipart/form-data is set
          },
        }
      );

      if (response.status === 200) {
        alert(response.data.message);
        fetchdata();
        fetchFeatureListdata();
        handleReset();

        console.log("Success:", response.data);
      } else {
        console.error("Error:", response);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const updatefeatureName = async () => {
    const formData = new FormData();

    // Append form fields
    formData.append("featureName", featureName);
    if (featureImage) {
      formData.append("image", featureImage);
    }
    try {
      const response = await axiosInstance.put(
        `/api/update/room-feature/${featureNameId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure multipart/form-data is set
          },
        }
      );

      // Handle the response from the server
      if (response.status === 200) {
        fetchdata();
        fetchFeatureListdata();
        alert(response.data.message);
        handleReset();
      }
    } catch (error) {
      // Handle errors

      console.error("Error updating featureName:", error.message);
      alert("An error occurred while updating the featureName.");
    }
  };

  const deletefeatureName = async (featureId) => {
    const confirmation = window.confirm("Are you sure delete this row");
    if (!confirmation) {
      return;
    }
    try {
      const response = await axiosInstance.delete(
        `/api/delete/room-feature/${featureId}/`
      );

      // Handle the response from the server
      if (response.status === 200) {
        fetchdata();
        fetchFeatureListdata();
        handleReset();
        alert(response.data.message);
      }
    } catch (error) {
      // Handle errors

      console.error("Error updating featureName:", error.message);
      alert("An error occurred while delete the displayslider.");
    }
  };
  const handleImageFileChange = (file) => {
    setFeatureImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      <Modal
        title="Add Room Feature"
        centered
        open={featureModalVisible}
        onOk={() => {
          setFeatureModalVisible(false);
          setFormErrors({});
          handleReset();
        }}
        onCancel={() => {
          setFeatureModalVisible(false);
          setFormErrors({});
          handleReset();
        }}
        width={1000}
        footer
      >
        <div className="w-full">
          <div className="border shadow-small rounded-md  w-full py-6 flex md:flex-row flex-col  md:items-center items-start justify-center gap-2 px-2">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 md:items-center justify-center relative md:flex-row flex-col  md:w-auto w-full">
                <label
                  htmlFor="roomName"
                  className="md:w-32 font-medium text-sm text-gray-700"
                >
                  Feature Name*
                </label>
                <input
                  type="text"
                  id="roomName"
                  placeholder="write your feature name "
                  className={`${
                    formErrors.featureName
                      ? "border-red-700"
                      : "border-slate-300"
                  }  rounded-md md:w-[29.8vw] w-full`}
                  onChange={(e) => {
                    setFeatureName(e.target.value);
                    formErrors.sliderName = "";
                  }}
                  value={featureName}
                />
                {formErrors.featureName && (
                  <div className="absolute md:top-11 top-16 md:mt-0 mt-1 text-xs text-red-700 md:left-32 md:ml-2">
                    {formErrors.featureName}
                  </div>
                )}
              </div>
              <div className="flex gap-2 md:items-center justify-center relative md:flex-row flex-col  md:w-auto w-full">
                <label
                  htmlFor="roomName"
                  className="md:w-32 font-medium text-sm text-gray-700"
                >
                  Feature Image*
                </label>
                <input
                  type="file"
                  id="roomName"
                  ref={fileInputRef}
                  placeholder="write your decent room name"
                  className={`${
                    formErrors.sliderImage
                      ? "border-red-700"
                      : "border-slate-300"
                  }  rounded-md md:w-[29.8vw] w-full border  text-sm`}
                  onChange={(e) => {
                    handleImageFileChange(e.target.files[0]);
                    formErrors.sliderImage = "";
                  }}
                />
                {formErrors.sliderImage && (
                  <div className="absolute md:top-9 top-16 md:mt-0 mt-1 text-xs text-red-700 md:left-32 md:ml-2">
                    {formErrors.sliderImage}
                  </div>
                )}
              </div>
              {featureNameId ? (
                <button
                  className="bg-textColor md:w-auto   px-10 py-2 text-white rounded"
                  onClick={updatefeatureName}
                >
                  update
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
            <div className="w-[15vw] h-[19.5vh] border ml-2 flex items-center justify-center">
              {imagePreviews ? (
                <img
                  src={imagePreviews}
                  alt=""
                  className="w-[50px] h-[50px] object-cover"
                />
              ) : (
                <img
                  src="https://images.vexels.com/content/131734/preview/photo-preview-frame-icon-07abb6.png"
                  alt=""
                  className="w-[50px] h-[50px]"
                />
              )}
            </div>
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
                      Feature Name
                    </th>
                    <th scope="col" className=" px-6 py-3">
                      Feature Image
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
                      className={` ${
                        featureNameId === item.id
                          ? "bg-textColor text-white"
                          : "bg-white"
                      }   px-3 border-b cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:bg-textColor hover:text-white dark:hover:bg-gray-600`}
                    >
                      <td className="  px-6 py-3">{index + 1}</td>
                      <td className="  px-6 py-3">{item.feature_name}</td>
                      <td className="md:px-6 py-4 md:h-20 h-[70px]  ">
                        <img
                          src={`${import.meta.env.VITE_BASE_URL}${
                            item.feature_images
                          }`}
                          className="h-full md:w-auto w-full"
                          alt={item.feature_name}
                        ></img>
                      </td>
                      <td className="  px-6 py-3">
                        <button
                          onClick={() => deletefeatureName(item.id)}
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
export default AddRoomFeatures;

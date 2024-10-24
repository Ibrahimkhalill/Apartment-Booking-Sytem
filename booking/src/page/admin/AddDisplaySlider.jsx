import { useEffect, useState } from "react";
import Sidebar from "../../component/admin/Sidebar";
import axiosInstance from "../../component/axioxinstance";
import { RxUpdate } from "react-icons/rx";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const AddDisplaySlider = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState("");
  const [sliderImage, setSliderImage] = useState("");
  const [sliderName, setSliderName] = useState("");
  const [sliderDesCription, setsliderDescription] = useState("");
  const [sliderButton, setsliderButton] = useState("");
  const [sliderId, setSliderId] = useState(null);


  const fetchdata = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/get/display-slider/");
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

  // Handle viewing reservation details
  const handleviewDeatils = (item) => {
    if (sliderId === item.id) {
      handleReset();
    } else {
      setSliderId(item.id);
      setSliderName(item.name);
      setsliderButton(item.button_name);
      setsliderDescription(item.description);

      setImagePreviews(`${import.meta.env.VITE_BASE_URL}${item.slider_image}`);
    }
  };

  const validateRoomData = (
    sliderName,
    sliderDesCription,
    sliderButton,
    sliderImage
  ) => {
    const errors = {};

    // Check required fields
    if (!sliderName) {
      errors.sliderName = "Slider name is required.";
    }
    if (!sliderDesCription) {
      errors.sliderDesCription = "Slider description is required.";
    }
    if (!sliderButton) {
      errors.sliderButton = "Slider button name is required.";
    }
    if (!sliderImage) {
      errors.sliderImage = "Slider Image is required.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate room data
    const validationErrors = validateRoomData(
      sliderName,
      sliderDesCription,
      sliderButton,
      sliderImage
    );
    if (Object.keys(validationErrors).length > 0) {
      console.error("Validation errors:", validationErrors);
      setFormErrors(validationErrors);
      return; // Stop submission if there are errors
    }

    // Additional validation for features and images

    // Clear previous errors
    setFormErrors({});

    const formData = new FormData();

    // Append form fields
    formData.append("name", sliderName);
    formData.append("description", sliderDesCription);
    formData.append("button", sliderButton);
    formData.append("image", sliderImage);

    try {
      console.log("formData entries:", [...formData.entries()]); // Check the formData content

      // Send formData directly in the Axios request
      const response = await axiosInstance.post(
        "/api/add/display-slider/",
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
        handleReset();
        console.log("Success:", response.data);
      } else {
        console.error("Error:", response);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const updateDisplaySlider = async () => {
    const formData = new FormData();

    formData.append("name", sliderName);
    formData.append("description", sliderDesCription);
    formData.append("button", sliderButton);
    if (sliderImage) {
      formData.append("image", sliderImage);
    }

    try {
      const response = await axiosInstance.put(
        `/api/update/display-slider/${sliderId}/`,
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
        handleReset();
        alert("Reservation updated successfully:", response.data.message);
      }
    } catch (error) {
      // Handle errors

      console.error("Error updating reservation:", error.message);
      alert("An error occurred while updating the reservation.");
    }
  };

  const deleteDisplaySlider = async (sliderId) => {
    const confirmation = window.confirm("Are you sure delete this row");
    if (!confirmation) {
      return;
    }
    try {
      const response = await axiosInstance.delete(
        `/api/delete/display-slider/${sliderId}/`
      );

      // Handle the response from the server
      if (response.status === 200) {
        fetchdata();
        handleReset();
        alert("Reservation updated successfully:", response.data.message);
      }
    } catch (error) {
      // Handle errors

      console.error("Error updating reservation:", error.message);
      alert("An error occurred while delete the displayslider.");
    }
  };
  const handleReset = () => {
    setSliderId(null);
    setSliderName("");
    setsliderButton("");
    setsliderDescription("");
    setSliderImage("");
    setImagePreviews("");
  };

  const handleImageFileChange = (file) => {
    setSliderImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Sidebar>
      <div className="mb-3">
        <h3 className="text-center pb-2 font-medium text-2xl">
          Add Display Slider
        </h3>
        <div className="border w-full h-[37vh] shadow-small px-2 py-3 flex flex-col gap-4   justify-center">
          <div className="flex  gap-4 items-center  justify-center">
            <div className="flex flex-col gap-5">
              <div className="flex gap-2 md:items-center relative md:flex-row flex-col w-full ">
                <label
                  htmlFor="roomName"
                  className="md:w-32 font-medium text-sm text-gray-700"
                >
                  Slider Title
                </label>
                <input
                  type="text"
                  id="roomName"
                  placeholder="write your decent slider name"
                  className={`${
                    formErrors.sliderName
                      ? "border-red-700"
                      : "border-slate-300"
                  }  rounded-md md:w-[29.8vw] w-full`}
                  onChange={(e) => {
                    setSliderName(e.target.value);
                    formErrors.sliderName = "";
                  }}
                  value={sliderName}
                />
                {formErrors.sliderName && (
                  <div className="absolute md:top-10 top-16 md:mt-0 mt-1 text-xs text-red-700 md:left-32 md:ml-2">
                    {formErrors.sliderName}
                  </div>
                )}
              </div>
              <div className="flex gap-2 md:items-center relative md:flex-row flex-col w-full ">
                <label
                  htmlFor="roomName"
                  className="md:w-32 font-medium text-sm text-gray-700"
                >
                  Slider Description
                </label>
                <textarea
                  type="text"
                  id="roomName"
                  placeholder="write your slider description"
                  className={`${
                    formErrors.sliderDesCription
                      ? "border-red-700"
                      : "border-slate-300"
                  }  rounded-md md:w-[29.8vw] w-full resize-none`}
                  onChange={(e) => {
                    setsliderDescription(e.target.value);
                    formErrors.sliderDesCription = "";
                  }}
                  value={sliderDesCription}
                />
                {formErrors.sliderDesCription && (
                  <div className="absolute md:bottom-10 top-16 md:mt-0 mt-1 text-xs text-red-700 md:left-32 md:ml-2">
                    {formErrors.sliderDesCription}
                  </div>
                )}
              </div>
              <div className="flex gap-2 md:items-center relative md:flex-row flex-col w-full ">
                <label
                  htmlFor="roomName"
                  className="md:w-32 font-medium text-sm text-gray-700"
                >
                  Slider Button
                </label>
                <input
                  type="text"
                  id="roomName"
                  placeholder="write your slider button name"
                  className={`${
                    formErrors.sliderButton
                      ? "border-red-700"
                      : "border-slate-300"
                  }  rounded-md md:w-[29.8vw] w-full`}
                  onChange={(e) => {
                    setsliderButton(e.target.value);
                    formErrors.sliderButton = "";
                  }}
                  value={sliderButton}
                />
                {formErrors.sliderButton && (
                  <div className="absolute md:top-10 top-16 md:mt-0 mt-1 text-xs text-red-700 md:left-32 md:ml-2">
                    {formErrors.sliderButton}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 md:items-center relative md:flex-row flex-col w-full ">
                <label
                  htmlFor="roomName"
                  className="md:w-32 font-medium text-sm text-gray-700"
                >
                  Slider Image
                </label>
                <input
                  type="file"
                  id="roomName"
                  placeholder="write your decent room name"
                  className={`${
                    formErrors.sliderImage
                      ? "border-red-700"
                      : "border-slate-300"
                  }  rounded-md md:w-[29.8vw] w-full border  text-xs`}
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
              <div className="flex mt-1">
                <label
                  htmlFor="roomName"
                  className="md:w-32 font-medium text-sm text-gray-700"
                >
                  Image Preview
                </label>
                <div className="w-[20vw] h-[20vh] border ml-2 flex items-center justify-center">
                  {imagePreviews ? (
                    <img
                      src={imagePreviews}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="https://images.vexels.com/content/131734/preview/photo-preview-frame-icon-07abb6.png"
                      alt=""
                      className="w-[70px] h-[70px]"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            {sliderId ? (
              <button
                className="bg-textColor w-full px-10 py-2 text-white rounded"
                onClick={updateDisplaySlider}
              >
                Update
              </button>
            ) : (
              <button
                className="bg-textColor w-full px-10 py-2 text-white rounded"
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-5">
        <h2 className="text-xl font-medium">View Display Slider</h2>
        <div className="relative  sm:rounded-lg w-full my-2">
          <div className="relative overflow-x-auto sm:max-h-[30vh] shadow-md sm:rounded-lg w-full">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    Serial
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Slider Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Slider Description
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Button name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Image
                  </th>

                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    // Corrected event handler
                    key={index}
                    className="bg-white border-b cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4 w-[300px]">{item.description}</td>
                    <td className="px-6 py-4">{item.button_name}</td>

                    <td className="px-6 py-4">
                      <img
                        src={`${import.meta.env.VITE_BASE_URL}${
                          item.slider_image
                        }`}
                        alt=""
                        className="h-[100px] w-[200px] object-cover"
                      />
                    </td>
                    <td className=" py-4">
                      <button
                        className="font-medium ml-4 text-blue-600 dark:text-blue-500 hover:underline h-8"
                        title="Edit"
                        onClick={() => handleviewDeatils(item)}
                      >
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/6218/6218938.png"
                          alt=""
                          className="h-full"
                        />
                      </button>
                      <button
                        onClick={() => deleteDisplaySlider(item.id)}
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
    </Sidebar>
  );
};

export default AddDisplaySlider;

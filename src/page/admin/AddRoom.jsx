import Sidebar from "../../component/admin/Sidebar";
import { IoMdArrowForward } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { useEffect, useState } from "react";
import axiosInstance from "../../component/axioxinstance";
import { IoCloseCircle } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";

const AddRoom = () => {
  const [rows, setRows] = useState([{ image: "" }]);
  const [formErrors, setFormErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});
  const [chosenFeatures, setChosenFeatures] = useState([]);
  const [bedTypeData, setBedTypeData] = useState([]);
  const [roomSizeData, setRoomsizeData] = useState([]);
  const [availableFeatures, setAvailableFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]); // Track multiple selected features
  const [selectedChossenFeatures, setSelectedChossenFeatures] = useState([]); // Track multiple selected features
  const [roomData, setRoomData] = useState({
    roomNo: "",
    roomName: "",
    bedType: "",
    size: "",
    maxPeople: "",
    quantity: "",
    price: "",
    description: "",
  });

  const fetchFeatureListdata = async () => {
    try {
      const response = await axiosInstance.get("/api/get_feature/list/");
      if (response.status === 200) {
        setAvailableFeatures(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchBedtype = async () => {
    try {
      const response = await axiosInstance.get("/api/get_all_bed_type");
      if (response.status === 200) {
        setBedTypeData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchRomSize = async () => {
    try {
      const response = await axiosInstance.get("/api/get_all_size/");
      console.log(response.data);
      
      if (response.status === 200) {
        setRoomsizeData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchBedtype();
    fetchRomSize();
    fetchFeatureListdata();
  }, []);

  const handleImageFileChange = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({
          ...prev,
          [index]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleImageChange = (index, event) => {
    const newRows = [...rows];
    newRows[index].image = event.target.files[0];
    setRows(newRows);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      images: "", // Corrected line to clear the error for the features field
    }));
  };
  const addRow = () => {
    setRows([...rows, { image: "" }]);
  };
  const removeRow = (idToRemove) => {
    if (rows.length === 1) {
      return;
    }
    setRows(rows.filter((_, index) => index !== idToRemove));
    setImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[idToRemove];
      return newPreviews;
    });
  };

  // Function to move single item from available to chosen
  const handleChooseFeatures = () => {
    if (selectedFeatures.length > 0) {
      setChosenFeatures([...chosenFeatures, ...selectedFeatures]);
      setAvailableFeatures(
        availableFeatures.filter((f) => !selectedFeatures.includes(f))
      );
      // Clear the error for features

      setFormErrors((prevErrors) => ({
        ...prevErrors,
        features: "", // Corrected line to clear the error for the features field
      }));

      setSelectedFeatures([]); // Clear selected features after moving
    }
  };

  // Function to remove selected features from chosenFeatures
  const handleRemoveFeatures = () => {
    if (selectedChossenFeatures.length > 0) {
      setAvailableFeatures([...availableFeatures, ...selectedChossenFeatures]);
      setChosenFeatures(
        chosenFeatures.filter((f) => !selectedChossenFeatures.includes(f))
      );
      setSelectedChossenFeatures([]); // Clear selected features after removing
    }
  };

  // Handle selecting/deselecting features from the list
  const handleFeatureSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) =>
      availableFeatures.find((f) => f.id === parseInt(option.value))
    );
    setSelectedFeatures(selectedOptions);
  };
  const handleChoosenFeatureSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) =>
      chosenFeatures.find((f) => f.id === parseInt(option.value))
    );
    setSelectedChossenFeatures(selectedOptions);
  };

  // Function to choose all features
  const handleChooseAll = () => {
    setChosenFeatures([...chosenFeatures, ...availableFeatures]);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      features: "", // Corrected line to clear the error for the features field
    }));
    setAvailableFeatures([]);
  };

  // Function to remove all chosen features
  const handleRemoveAll = () => {
    setAvailableFeatures([...availableFeatures, ...chosenFeatures]);
    setChosenFeatures([]);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setRoomData((prevState) => ({
      ...prevState,
      [id]: value, // Dynamically update the correct property in the state
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [id]: "", // Clear the error for the field being changed
    }));
  };

  const handleReset = () => {
    setRoomData({
      roomNo: "",
      roomName: "",
      bedType: "",
      size: "",
      maxPeople: "",
      quantity: "",
      price: "",
      description: "",
    });
    setChosenFeatures([]);
    setRows([{ image: "" }]);
    setImagePreviews({});
  };

  const validateRoomData = (data) => {
    const errors = {};

    // Check required fields
    if (!data.roomNo) {
      errors.roomNo = "Room number is required.";
    }
    if (!data.roomName) {
      errors.roomName = "Room name is required.";
    }
    if (!data.bedType) {
      errors.bedType = "Bed type is required.";
    }
    if (!data.size) {
      errors.size = "Size is required.";
    }
    if (!data.maxPeople) {
      errors.maxPeople = "Maximum people is required.";
    }
    if (!data.quantity) {
      errors.quantity = "Quantity is required.";
    }
    if (!data.price) {
      errors.price = "Price is required.";
    }
    if (!data.description) {
      errors.description = "Description is required.";
    }

    // Check numeric values
    if (data.maxPeople && isNaN(data.maxPeople)) {
      errors.maxPeople = "Maximum people must be a number.";
    }
    if (data.quantity && isNaN(data.quantity)) {
      errors.quantity = "Quantity must be a number.";
    }
    if (data.price && isNaN(data.price)) {
      errors.price = "Price must be a number.";
    }
    if (chosenFeatures.length === 0) {
      errors.features = "Select at least one feature.";
    }
    if (rows.length === 0 || !rows.some((row) => row.image)) {
      errors.images = "At least one image is required.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate room data
    const validationErrors = validateRoomData(roomData);
    if (Object.keys(validationErrors).length > 0) {
      console.error("Validation errors:", validationErrors);
      setFormErrors(validationErrors);
      return; // Stop submission if there are errors
    }

    // Additional validation for features and images

    // Clear previous errors
    setFormErrors({});

    const formData = new FormData();
    const chosenFeatureIds = chosenFeatures.map((feature) => feature.id);

    // Append form fields
    formData.append("roomNo", roomData.roomNo);
    formData.append("roomName", roomData.roomName);
    formData.append("bedType", roomData.bedType);
    formData.append("size", roomData.size);
    formData.append("maxPeople", roomData.maxPeople);
    formData.append("quantity", roomData.quantity);
    formData.append("price", roomData.price);
    formData.append("description", roomData.description);
    formData.append("features", JSON.stringify(chosenFeatureIds));

    // Append images
    rows.forEach((image) => {
      formData.append("images", image.image); // No index in the key, just "images"
    });

    try {
      console.log("formData entries:", [...formData.entries()]); // Check the formData content

      // Send formData directly in the Axios request
      const response = await axiosInstance.post(
        "api/save-room/data/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure multipart/form-data is set
          },
        }
      );

      if (response.status === 200) {
        alert(response.data.message);
        handleReset();
        console.log("Success:", response.data);
      } else {
        console.error("Error:", response);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };
  console.log("roomSizeData",roomSizeData);

  return (
    <Sidebar>
      <div className="flex flex-col">
        <h1 className="text-2xl font-medium text-center  pb-2">Add Room</h1>
        <div className="text-lg font-semibold pt-2">Room Information</div>
        <div className=" py-5 flex flex-col gap-3">
          <div className="flex md:flex-row flex-col gap-4">
            {/* Input fields */}
            <div className="flex flex-col gap-5 items-start">
              <div className="flex flex-col items-start relative w-full">
                <div className="flex gap-2 md:items-center relative md:flex-row flex-col w-full ">
                  <label
                    htmlFor="roomNo"
                    className="md:w-32 font-medium text-sm text-gray-700"
                  >
                    Room No
                  </label>
                  <input
                    type="text"
                    id="roomNo"
                    placeholder="write your room no"
                    value={roomData.roomNo}
                    onChange={handleChange}
                    className={`${
                      formErrors.roomNo ? "border-red-700" : "border-slate-300"
                    }  rounded-md md:w-[30vw] w-full`}
                  />
                </div>
                {formErrors.roomNo && (
                  <div className="absolute md:top-10 top-16 md:mt-0 mt-1 text-xs text-red-700 md:left-32 md:ml-2">
                    {formErrors.roomNo}
                  </div>
                )}
              </div>
              <div className="flex gap-2 md:items-center relative md:flex-row flex-col w-full ">
                <label
                  htmlFor="roomName"
                  className="md:w-32 font-medium text-sm text-gray-700"
                >
                  Room Name
                </label>
                <input
                  type="text"
                  id="roomName"
                  placeholder="write your decent room name"
                  value={roomData.roomName}
                  onChange={handleChange}
                  className={`${
                    formErrors.roomName ? "border-red-700" : "border-slate-300"
                  }  rounded-md md:w-[30vw] w-full`}
                />
                {formErrors.roomName && (
                  <div className="absolute md:top-10 top-16 md:mt-0 mt-1 text-xs text-red-700 md:left-32 md:ml-2">
                    {formErrors.roomName}
                  </div>
                )}
              </div>
              <div className="flex gap-2 md:items-center relative md:flex-row flex-col w-full">
                <label
                  htmlFor="bedType"
                  className="md:w-32 font-medium text-sm text-gray-700"
                >
                  Bed Type
                </label>
                <input
                  type="text"
                  id="bedType"
                  list="bedTypes"
                  placeholder="write your bed type"
                  value={roomData.bedType}
                  onChange={handleChange}
                  className={`${
                    formErrors.bedType ? "border-red-700" : "border-slate-300"
                  }  rounded-md md:w-[30vw] w-full`}
                />
                {formErrors.bedType && (
                  <div className="absolute md:top-10 top-16 md:mt-0 mt-1 text-xs text-red-700 md:left-32 md:ml-2">
                    {formErrors.bedType}
                  </div>
                )}

                <datalist id="bedTypes">
                  {bedTypeData.map((item) => (
                    <option key={item.id} value={item.bed_type} />
                  ))}
                </datalist>
              </div>
              <div className="flex gap-2 md:items-center relative md:flex-row flex-col w-full">
                <label
                  htmlFor="size"
                  className="md:w-32 font-medium text-sm text-gray-700"
                >
                  Size
                </label>
                <input
                  type="text"
                  id="size"
                  list="roomSizes"
                  placeholder="write your room size"
                  value={roomData.size}
                  onChange={handleChange}
                  className={`${
                    formErrors.size ? "border-red-700" : "border-slate-300"
                  }  rounded-md md:w-[30vw] w-full`}
                />
                {formErrors.size && (
                  <div className="absolute md:top-10 top-16 md:mt-0 mt-1 text-xs text-red-700 md:left-32 md:ml-2">
                    {formErrors.size}
                  </div>
                )}
                <datalist id="roomSizes">
                  {roomSizeData.map((item) => (
                    <option key={item.id} value={item.size} />
                  ))}
                </datalist>
              </div>
              <div className="flex gap-2 md:items-center relative md:flex-row flex-col w-full">
                <label
                  htmlFor="maxPeople"
                  className="md:w-32 font-medium text-sm text-gray-700"
                >
                  Max Room People
                </label>
                <input
                  type="number"
                  id="maxPeople"
                  placeholder="write your room maximum people allow"
                  value={roomData.maxPeople}
                  onChange={handleChange}
                  className={`${
                    formErrors.maxPeople ? "border-red-700" : "border-slate-300"
                  }  rounded-md md:w-[30vw] w-full`}
                />
                {formErrors.maxPeople && (
                  <div className="absolute md:top-10 top-16 md:mt-0 mt-1 text-xs text-red-700 md:left-32 md:ml-2">
                    {formErrors.maxPeople}
                  </div>
                )}
              </div>
              <div className="flex gap-2 md:items-center relative md:flex-row flex-col w-full">
                <label
                  htmlFor="quantity"
                  className="md:w-32 font-medium text-sm text-gray-700"
                >
                  Room Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  placeholder="write your room quantity"
                  value={roomData.quantity}
                  onChange={handleChange}
                  className={`${
                    formErrors.quantity ? "border-red-700" : "border-slate-300"
                  }  rounded-md md:w-[30vw] w-full`}
                />
                {formErrors.quantity && (
                  <div className="absolute md:top-10 top-16 md:mt-0 mt-1 text-xs text-red-700 md:left-32 md:ml-2">
                    {formErrors.quantity}
                  </div>
                )}
              </div>
              <div className="flex gap-2 md:items-center relative md:flex-row flex-col w-full">
                <label
                  htmlFor="price"
                  className="md:w-32 font-medium text-sm text-gray-700"
                >
                  Room Price
                </label>
                <input
                  type="number"
                  id="price"
                  placeholder="write your room price for per night"
                  value={roomData.price}
                  onChange={handleChange}
                  className={`${
                    formErrors.price ? "border-red-700" : "border-slate-300"
                  }  rounded-md md:w-[30vw] w-full`}
                />
                {formErrors.price && (
                  <div className="absolute md:top-10 top-16 md:mt-0 mt-1 text-xs text-red-700 md:left-32 md:ml-2">
                    {formErrors.price}
                  </div>
                )}
              </div>
            </div>

            {/* Room Description */}
            <div className="flex gap-3 flex-col items-start w-full relative">
              <label
                htmlFor="description"
                className="md:w-32 font-medium text-sm text-gray-700"
              >
                Room Description
              </label>
              <textarea
                id="description"
                placeholder="write a description"
                value={roomData.description}
                onChange={handleChange}
                className={`resize-none  ${
                  formErrors.description ? "border-red-700" : "border-slate-300"
                } rounded-md border px-2 w-full h-[49vh]`}
              />
              {formErrors.description && (
                <div className="absolute 2xl:bottom-0 -bottom-4 text-xs text-red-700 left-0 ">
                  {formErrors.description}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
        </div>

        <div className="">
          <h1 className="text-lg font-semibold">Room Feature</h1>
          <div className="flex md:flex-row flex-col items-center py-2 md:gap-5 gap-2 w-full">
            {/* Available Features */}
            <div
              className={
                "flex flex-col items-center py-2 gap-2 md:w-[50%] w-full "
              }
            >
              <div
                className={`border ${
                  formErrors.features ? "border-red-700" : "border-slate-300"
                }  h-[30vh] w-full rounded relative`}
              >
                <div className="bg-gray-500 py-2 text-white text-center flex items-center justify-center gap-2 rounded-t">
                  Available Features{" "}
                  <FaRegCircleQuestion title='This is the list of available features. You may choose some by selecting them in the box below and then clicking the "Choose" arrow between the two boxes.' />
                </div>
                <div className="h-[81%] features">
                  <select
                    multiple
                    className="w-full border-0 h-full"
                    value={selectedFeatures.map((feature) => feature?.id)}
                    onChange={handleFeatureSelect}
                  >
                    {availableFeatures.map((feature) => (
                      <option key={feature.id} value={feature?.id}>
                        {feature.feature_name}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.features && (
                  <div className="absolute md:-bottom-5 -top-5 text-xs text-red-700 left-0 ">
                    {formErrors.features}
                  </div>
                )}
              </div>
              <div className="w-full flex items-center justify-center">
                <button
                  className={`text-sm flex items-center gap-1 ${
                    availableFeatures.length === 0
                      ? "text-gray-400"
                      : "text-gray-600"
                  } `}
                  onClick={handleChooseAll}
                  title="Click to choose all features at once."
                  disabled={availableFeatures.length === 0}
                >
                  Choose All <IoIosArrowDroprightCircle size={16} />
                </button>
              </div>
            </div>

            {/* Move buttons */}
            <div className="flex md:flex-col gap-2 md:px-1 px-3 py-2 bg-gray-200 items-center justify-center rounded-full md:h-[7vh]">
              <button
                className={`${
                  selectedFeatures.length > 0 ? "bg-gray-500" : "bg-gray-400"
                }  rounded-full text-white md:rotate-0 rotate-90 md:text-sm text-lg`}
                onClick={() => handleChooseFeatures()}
              >
                <IoMdArrowForward />
              </button>
              <button
                className={`${
                  selectedChossenFeatures.length > 0
                    ? "bg-gray-500"
                    : "bg-gray-400"
                }  rounded-full text-white md:rotate-0 rotate-90 md:text-sm text-lg`}
                onClick={() => handleRemoveFeatures()}
              >
                <IoMdArrowBack />
              </button>
            </div>

            {/* Chosen Features */}
            <div className="flex flex-col items-center py-2 gap-2 md:w-[50%] w-full">
              <div
                className={`border ${
                  formErrors.features ? "border-red-700" : "border-slate-300"
                }  h-[30vh] w-full rounded relative`}
              >
                <div className="bg-textColor py-2 text-white text-center flex items-center justify-center gap-2 rounded-t">
                  Chosen Features{" "}
                  <FaRegCircleQuestion title='This is the list of chosen features. You may remove some by selecting them in the box below and then clicking the "Remove" arrow between the two boxes.' />
                </div>
                <div className="h-[81%] features">
                  <select
                    id="features"
                    multiple
                    className="w-full border-0 h-full"
                    onChange={handleChoosenFeatureSelect} // Handle multiple selections for chosen features
                    value={selectedChossenFeatures.map(
                      (feature) => feature?.id
                    )}
                  >
                    {chosenFeatures.map((feature) => (
                      <option key={feature.id} value={feature.id}>
                        {feature.feature_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="w-full flex items-center justify-center">
                <button
                  className={`text-sm flex items-center  gap-1 ${
                    chosenFeatures.length === 0
                      ? "text-gray-400"
                      : "text-gray-600"
                  } `}
                  onClick={handleRemoveAll}
                  title="Click to remove all chosen features at once."
                  disabled={chosenFeatures.length === 0}
                >
                  <IoIosArrowDropleftCircle size={16} /> Remove All
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 w-full">
          <div className="text-lg bg-textColor text-white py-1 px-2 font-semibold">
            Room Images
          </div>
          <div className="w-full   flex flex-col gap-2">
            {rows.map((item, index) => (
              <div
                key={index}
                className="w-full flex flex-row gap-2  md:gap-10 items-center relative"
              >
                <div className="md:w-[50%] w-full">
                  <input
                    type="file"
                    className={`w-full border rounded text-xs ${
                      formErrors.images ? "border-red-700" : "border-slate-300"
                    }`}
                    id={`image-${index}`}
                    onChange={(e) => {
                      handleImageFileChange(index, e.target.files[0]);
                      handleImageChange(index, e); // If this function also needs to handle image change
                    }}
                  />
                </div>
                <div className="mb-2 md:block hidden">
                  {imagePreviews[index] ? (
                    <img
                      src={imagePreviews[index]}
                      alt={`Preview ${index}`}
                      style={{ width: "100px", height: "100px" }}
                    />
                  ) : (
                    <div className="w-[100px] h-[100px] border flex items-center justify-center text-sm text-gray-300">
                      Image Preview
                    </div>
                  )}
                </div>
                <div className="image_add_button d-flex gap-3">
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className=" text-red-700 px-1 py-1 rounded"
                      title="Remove Image"
                    >
                      <IoCloseCircle size={18} />
                    </button>
                  )}
                </div>
                {formErrors.images && (
                  <div className="absolute md:bottom-5 -bottom-4 text-xs text-red-700 left-0 ">
                    {formErrors.images}
                  </div>
                )}
              </div>
            ))}
            <div className="bg-gray-200 py-2 w-full">
              <button
                className="text-slate-600 font-semibold flex  gap-1  px-3  text-sm rounded"
                onClick={addRow}
              >
                <FaPlus size={17} className="text-textColor font-bold" /> Add
                Another Image
              </button>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center my-5 ">
          <button
            className="bg-textColor text-white rounded py-2 md:w-[50%] w-full"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </Sidebar>
  );
};

export default AddRoom;

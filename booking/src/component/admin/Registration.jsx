import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { IoWarningOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { FaRegEyeSlash } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import React from "react";

const Registration = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill("")); // For OTP
  const [otpVisible, setOtpVisible] = useState(false); // Controls OTP input visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const navigate = useNavigate();

  const inputRefs = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ]);

  const handleBackspace = (index, e) => {
    if (e.keyCode === 8 && index > 0 && e.target.value === "") {
      inputRefs.current[index - 1].current.focus();
    }
  };

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const newOtpValues = [...otp];
      newOtpValues[index] = value;
      setOtp(newOtpValues);
      if (index < inputRefs.current.length - 1 && value !== "") {
        inputRefs.current[index + 1].current.focus();
      }
    }
  };
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, otp.length); // Limiting to OTP length
    const newOtpValues = [...otp];
    pasteData.split("").forEach((char, i) => {
      if (i < newOtpValues.length) {
        newOtpValues[i] = char;
      }
    });
    setOtp(newOtpValues);
  };

  const handleSendOtp = async () => {
    if (!email || !username || !password) {
      setError("All fields are required");
      setErrorModalVisible(true);
      return;
    }
    if (password.length < 6) {
      setError("Minimum 6 digit password required");
      setErrorModalVisible(true);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/send/otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      if (response.ok) {
        setOtpVisible(true); // Show OTP input after sending OTP
      } else {
        const data = await response.json();
        setError(data.message);
        setErrorModalVisible(true);
      }

      setLoading(false);
    } catch (err) {
      setError("An error occurred while sending OTP");
      setErrorModalVisible(true);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/verify-otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: otpValue,
          }),
        }
      );

      if (response.ok) {
        // If OTP is verified, proceed with signup
        handleSignup();
      } else {
        const data = await response.json();
        setError(data.message);
        setErrorModalVisible(true);
      }

      setLoading(false);
    } catch (err) {
      setError("An error occurred while verifying OTP");
      setErrorModalVisible(true);
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/signup/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
            phone_number,
          }),
        }
      );

      if (response.ok) {
        // Optionally log in the user after signup, or redirect
        navigate("/admin/login");
      } else {
        const data = await response.json();
        setError(data.message);
        setErrorModalVisible(true);
      }

      setLoading(false);
    } catch (err) {
      setError("An error occurred during registration");
      setErrorModalVisible(true);
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          {error && (
            <div className="absolute md:top-4 top-10 md:w-auto w-[85%] sm:left-1/2 sm:-translate-x-1/2  mb-4 flex items-center justify-center">
              <div className="flex items-center gap-10 bg-red-200 px-4 py-3 rounded text-sm">
                <div className="flex items-center gap-2">
                  <IoWarningOutline size={20} className="text-red-700" />
                  {error}
                </div>
                <button onClick={() => setError("")}>
                  <IoMdClose
                    size={18}
                    className="text-red-700 cursor-pointer"
                  />
                </button>
              </div>
            </div>
          )}

          <div className="p-4 space-y-4 md:space-y-5 sm:p-8">
            <h1 className="text-xl text-center  font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {otpVisible ? "OTP" : "Sign up for an account"}
            </h1>

            {!otpVisible ? (
              // Registration form before OTP is sent
              <>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block mb-2  text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className={` ${
                      password ? "block" : "hidden"
                    } absolute top-1/2 right-2 mt-1 text-gray-600`}
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? (
                      <IoEyeOutline size={20} />
                    ) : (
                      <FaRegEyeSlash size={20} />
                    )}
                  </button>
                </div>
                <div>
                  <label
                    htmlFor="phone_number"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone Number (optional)
                  </label>
                  <input
                    type="text"
                    name="phone_number"
                    id="phone_number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={phone_number}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    disabled={loading}
                  >
                    {loading ? <span className="loader_white "></span> : "Sign Up"}
                  </button>
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/admin/login"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Log In
                  </Link>
                </p>
              </>
            ) : (
              // OTP Verification form
              <div className="flex gap-4 flex-col items-center justify-center w-full">
                <div className="text-sm border-b pb-3">
                  We have sent a 6 digit code to{" "}
                  <span className="font-bold">{email}</span> . Put the code in
                  the box below and move forward.
                </div>
                <div className="flex justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      className="md:w-[57px] w-10 text-center bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2 mx-1"
                      maxLength="1"
                      value={digit}
                      ref={inputRefs.current[index]}
                      onChange={(e) => handleInputChange(e, index)}
                      onKeyDown={(e) => handleBackspace(index, e)}
                      onPaste={handlePaste}
                    />
                  ))}
                </div>
                <div className="w-full flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpVisible(false)}
                    className="w-[50%] text-white bg-slate-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="w-[50%] text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    disabled={loading}
                  >
                    {loading ? "Verifying OTP..." : "Verify OTP"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registration;

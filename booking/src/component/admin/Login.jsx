import React, { useState } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch
import { setEmail, setUsername,setLoggedIn } from "../authSlice"; // Update the path to your authSlice
import { Link, useNavigate } from "react-router-dom";
import { IoWarningOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { FaRegEyeSlash } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import Cookies from "js-cookie";
const Login = () => {
  // State to store email and password
  const [email, setEmailState] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // For error handling
  const dispatch = useDispatch(); // Initialize useDispatch
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/login/`,
        {
          method: "POST",
          credentials: "include", // This includes the cookies in the request
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }), // Sending email and password as JSON
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Handle successful login
        

        // Optionally update any local state, like username
        dispatch(setUsername(data.username));
        dispatch(setEmail(data.email));
        dispatch(setLoggedIn(true)); // User is logged in
        Cookies.set("a-token", data.token, {secure: true})
        // Redirect user to dashboard or another page
        navigate("/admin/dashboard");
      } else {
        setError(data.error || "Invalid login credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Error logging in:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900 relative ">
      {error && (
        <div className="absolute md:top-4 top-10 md:w-auto w-full sm:left-1/2 sm:-translate-x-1/2  flex items-center justify-center">
          <div className="flex items-center gap-10 bg-red-200 px-4 py-3 rounded text-sm">
            <div className="flex items-center gap-2">
              <IoWarningOutline size={20} className="text-red-700" />
              {error}
            </div>
            <button onClick={() => setError("")}>
              <IoMdClose size={18} className="text-red-700 cursor-pointer" />
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Basundara Apartment
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center pb-3 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Login
            </h1>

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required=""
                  value={email}
                  onChange={(e) => setEmailState(e.target.value)} // Update state on input change
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Update state on input change
                />
                <button
                  type="button"
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
              <div className="flex items-center justify-end">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-700 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {loading ? <span className="loader_white"></span> : "Login"}
              </button>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <Link
                  to="/admin/sign-up"
                  className="font-medium text-blue-700 hover:underline dark:text-primary-500"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;

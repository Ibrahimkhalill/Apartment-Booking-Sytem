import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { FaInstagram } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoIosCall } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const location = useLocation();

  return (
    <header className="pb-2 ">
      {/* RD Navbar */}
      <div className="relative ">
        <nav className="bg-white">
          <div className="md:flex justify-between items-center py-4 px-6 hidden">
            {/* Left Side - Social Icons */}
            <div className="flex items-center space-x-4 social_media">
              <span className="italic">Follow Us:</span>
              <ul className="flex space-x-4 ">
                <li>
                  <a className=" icon" href="#">
                    <FaInstagram />
                  </a>
                </li>
                <li>
                  <a className=" icon" href="#">
                    <FaFacebookF />
                  </a>
                </li>
                <li>
                  <a className=" icon" href="#">
                    <FaXTwitter />
                  </a>
                </li>
              </ul>
            </div>
            {/* Center - Logo */}
            <div className="flex justify-center">
              <a href="index.html">
                <img
                  src="images/logo-default-314x48.png"
                  alt="Logo"
                  className="h-12"
                />
              </a>
            </div>
            {/* Right Side - Contact Info */}
            <div className="flex items-center space-x-2">
              <IoIosCall size={20} color="gray" />

              <a href="tel:#" className=" text-lg">
                +88-01746185116
              </a>
            </div>
          </div>
          <div className="bg-gray-100 py-2 relative">
            {/* Mobile Toggle */}
            <div className="flex justify-between items-center px-6 md:hidden">
              {/* Mobile Logo */}
              <div className="mobile-brand py-4 flex items-center justify-between w-full">
                <a href="">
                  <img
                    src="images/logo-default-314x48.png"
                    alt="Logo"
                    className="h-7"
                  />
                </a>
                <RxHamburgerMenu
                  size={22}
                  onClick={() => setMenuVisible(!menuVisible)}
                />
              </div>
            </div>
            {/* Navigation Links */}
            <div className="md:flex justify-center py-4 hidden navbar">
              <ul className="flex space-x-6 uppercase gap-10">
                <li className="active">
                  <a href="/" className="">
                    Home
                  </a>
                </li>
                <li>
                  <Link to="/about" className="">
                    About
                  </Link>
                </li>
                <li>
                  <Link to={"/room"}>Rooms</Link>
                </li>
                <li>
                  <Link to="/contact" className="">
                    Contacts
                  </Link>
                </li>
              </ul>
            </div>
            {menuVisible && (
              <div className="absolute top-16 w-full z-50 bg-white items-start py-4">
                <ul className="flex flex-col px-4 items-start uppercase gap-6 w-full font-semibold">
                  <li
                    className={`${
                      location.pathname === "/"
                        ? "bg-blue-800 w-full text-white py-2 px-3 rounded-md "
                        : "px-2"
                    }`}
                  >
                    <a onClick={()=>setMenuVisible(false)} href="/">Home</a>
                  </li>
                  <li
                    className={`${
                      location.pathname === "/about"
                        ? "bg-blue-800 w-full text-white py-2 px-2 rounded-md"
                        : " px-3"
                    }`}
                  >
                    <Link  to="/about" onClick={()=>setMenuVisible(false)}>About</Link>
                  </li>
                  <li
                    className={`${
                      location.pathname === "/room"
                        ? "bg-blue-800 w-full text-white py-2 px-2 rounded-md"
                        : " px-3"
                    }`}
                  >
                    <Link to="/room" onClick={()=>setMenuVisible(false)}>Rooms</Link>
                  </li>
                  <li
                    className={`${
                      location.pathname === "/contact"
                        ? "bg-blue-800 w-full text-white py-2 px-2 rounded-md"
                        : " px-3"
                    }`}
                  >
                    <Link to="/contact" onClick={()=>setMenuVisible(false)}>Contacts</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

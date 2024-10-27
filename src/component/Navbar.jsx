import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import { IoIosCall } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import logo from "../assets/images/logo-default-314x48.png"
const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isFixed, setIsFixed] = useState(false); // State to handle fixed navbar
  // const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset); // Track the previous scroll position
  const location = useLocation();


  // Scroll event listener
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const currentScrollPos = window.pageYOffset;
  //     const isScrollingUp = prevScrollPos > currentScrollPos;

  //     // Set navbar to fixed only when scrolling up
  //     if (isScrollingUp && currentScrollPos > 50) {
  //       setIsFixed(true);
  //     } else {
  //       setIsFixed(false);
  //     }

  //     setPrevScrollPos(currentScrollPos);
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [prevScrollPos]);

  useEffect(() => {
    document.body.style.overflow = menuVisible ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuVisible]);
  return (
    <header
      className={`pb-2 ${
        isFixed
          ? "fixed transition-transform top-0 left-0 w-full shadow-md bg-white z-50"
          : ""
      }`}
    >
      <div className="relative">
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
                  src={logo}
                  alt="Logo"
                  className="h-12"
                />
              </a>
            </div>
            {/* Right Side - Contact Info */}
            <div className="flex items-center space-x-2">
              <IoIosCall size={20} color="gray" />
              <a href="tel:+8801622665200" className=" text-lg">
                +8801622665200
              </a>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="bg-gray-100 py-2 relative">
            <div className="flex justify-between items-center px-6 md:hidden">
              <div className="mobile-brand py-4 flex items-center justify-between w-full">
                <Link to="/">
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-7"
                  />
                </Link>
                <RxHamburgerMenu
                  size={26}
                  onClick={() => setMenuVisible(!menuVisible)}
                />
              </div>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="md:flex justify-center py-4 hidden navbar">
              <ul className="flex space-x-6 uppercase gap-10">
                <li
                  className={`${
                    location.pathname === "/" ? "text-blue-600" : ""
                  }`}
                >
                  <Link to="/">Home</Link>
                </li>
                <li
                  className={`${
                    location.pathname === "/about" ? "text-blue-600" : ""
                  }`}
                >
                  <Link to="/about">About</Link>
                </li>
                <li
                  className={`${
                    location.pathname === "/room" ? "text-blue-600" : ""
                  }`}
                >
                  <Link to="/room">Rooms</Link>
                </li>
                <li
                  className={`${
                    location.pathname === "/contact" ? "text-blue-600" : ""
                  }`}
                >
                  <Link to="/contact">Contacts</Link>
                </li>
              </ul>
            </div>

            {/* Mobile Menu */}
            {menuVisible && (
              <>
                <div
                  className="fixed inset-0 bg-slate-800 opacity-80 z-40 "
                  onClick={() => setMenuVisible(false)}
                ></div>
                <button
                  onClick={() => setMenuVisible(false)}
                  className="absolute top-1 z-50 left-16"
                >
                  <IoMdClose color="white" size={40} />
                </button>
                <div
                  className={`fixed h-screen w-[70%] right-0 top-0 pt-4 z-50 bg-white transform transition-transform duration-800 ease-in-out ${
                    menuVisible ? "translate-x-0" : "translate-x-full"
                  }`}
                >
                  <ul className="flex flex-col px-4 items-start uppercase gap-6 w-full font-semibold">
                    <li
                      className={`${
                        location.pathname === "/"
                          ? "bg-blue-800 w-full text-white py-2 px-3 rounded-md"
                          : "px-2"
                      }`}
                    >
                      <a onClick={() => setMenuVisible(false)} href="/">
                        Home
                      </a>
                    </li>
                    <li
                      className={`${
                        location.pathname === "/about"
                          ? "bg-blue-800 w-full text-white py-2 px-3 rounded-md"
                          : "px-2"
                      }`}
                    >
                      <Link to="/about" onClick={() => setMenuVisible(false)}>
                        About
                      </Link>
                    </li>
                    <li
                      className={`${
                        location.pathname === "/room"
                          ? "bg-blue-800 w-full text-white py-2 px-3 rounded-md"
                          : "px-2"
                      }`}
                    >
                      <Link to="/room" onClick={() => setMenuVisible(false)}>
                        Rooms
                      </Link>
                    </li>
                    <li
                      className={`${
                        location.pathname === "/contact"
                          ? "bg-blue-800 w-full text-white py-2 px-3 rounded-md"
                          : "px-2"
                      }`}
                    >
                      <Link to="/contact" onClick={() => setMenuVisible(false)}>
                        Contacts
                      </Link>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

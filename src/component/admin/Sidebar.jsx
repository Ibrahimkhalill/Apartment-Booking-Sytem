import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineViewCompactAlt } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../authSlice";
import LogoutModal from "./LogoutModal";

const Sidebar = ({ children }) => {
  const username = useSelector((state) => state.authentication.username);
  const email = useSelector((state) => state.authentication.email);

  const [dropdown, setDropDown] = useState(false);
  const dropDownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the dropdown
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setDropDown(false); // Close the dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isVisible, setIsVisible] = useState(false);
  const onClose = () => {
    setIsVisible(false);
  };
  return (
    <main>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden  focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <Link to="/admin/dashboard" className="flex ms-2 md:me-24">
                <img
                  src="https://flowbite.com/docs/images/logo.svg"
                  className="h-8 me-3"
                  alt="FlowBite Logo"
                />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  Basundara Apartment
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3 relative">
                <div>
                  <button
                    type="button"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                    onClick={() => setDropDown(!dropdown)}
                    ref={buttonRef}
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="w-8 h-8 rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                      alt="user photo"
                    />
                  </button>
                </div>
                {dropdown && (
                  <div
                    ref={dropDownRef}
                    className="z-50  absolute right-0 top-7 my-4 shadow-custom text-base list-none bg-white divide-y divide-gray-100 rounded  dark:bg-gray-700 dark:divide-gray-600"
                  >
                    <div className="px-4 py-3" role="none">
                      <p
                        className="text-sm text-gray-900 dark:text-white"
                        role="none"
                      >
                        {username}
                      </p>
                      <p
                        className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                        role="none"
                      >
                        {email}
                      </p>
                    </div>
                    <ul
                      className="py-1  px-2 flex justify-between w-full"
                      role="none"
                    >
                      <li>
                        <Link
                          to="/admin/profile"
                          className="block px-10 rounded bg-slate-600 border py-2 text-sm text-white  dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          Profile
                        </Link>
                      </li>

                      <li>
                        <button
                          className="block px-4 py-2 text-sm border rounded bg-textColor text-white   dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                          onClick={() => setIsVisible(!isVisible)}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white  dark:hover:bg-gray-700 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/add/reservation"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white  dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
                <span className="ms-3">Add New Reservation</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/view/reservation"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white  dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
                  <path d="M8.571 0C4.083 0 0 3.745 0 8.571c0 4.826 4.083 8.571 8.571 8.571 4.827 0 8.571-3.745 8.571-8.571C17.142 3.745 13.399 0 8.571 0ZM7.571 12.857c-.107 0-.214-.017-.321-.057-.314-.107-.643-.368-.643-.857v-5.143c0-.491.329-.75.643-.857.107-.04.214-.057.321-.057.271 0 .536.079.643.214v6.643c-.107.135-.372.214-.643.214ZM9.429 12.857c-.107 0-.214-.017-.321-.057-.314-.107-.643-.368-.643-.857V5.714c0-.491.329-.75.643-.857.107-.04.214-.057.321-.057.271 0 .536.079.643.214v6.643c-.107.135-.372.214-.643.214ZM8.571 1.714c1.393 0 2.571 1.197 2.571 2.714S9.964 7.143 8.571 7.143 6 5.946 6 4.429 7.179 1.714 8.571 1.714Z" />
                </svg>
                <span className="ms-3">View Reservation</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/add/room"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white  dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.928a1 1 0 011.902 0L15.7 12H4.3l3.749-9.072Z" />
                  <path
                    fillRule="evenodd"
                    d="M9.049 2.928a1 1 0 01-.948-1.175l.044-.236A1 1 0 0110 1h1a1 1 0 01.855.51l2.253 4.799 5.24 11.03A1 1 0 0117.5 20h-15a1 1 0 01-.893-1.447l5.238-11.04L9.049 2.928z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ms-3">Add Room</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/view/room"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white  dark:hover:bg-gray-700 group"
              >
                <MdOutlineViewCompactAlt size={24} className="text-gray-500" />
                <span className="ms-3">View Room</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/add/display-slider"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white  dark:hover:bg-gray-700 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000000"
                  version="1.1"
                  id="Layer_1"
                  viewBox="0 0 218.207 218.207"
                  xmlSpace="preserve"
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                >
                  <g>
                    <g>
                      <g>
                        <path d="M214.31,27.276H3.897C1.743,27.276,0,29.019,0,31.172v27.276v77.931v50.655c0,2.154,1.743,3.897,3.897,3.897H214.31     c2.154,0,3.897-1.743,3.897-3.897v-50.655V58.448V31.172C218.207,29.019,216.464,27.276,214.31,27.276z M7.793,62.345h35.069     v70.138H7.793V62.345z M210.414,132.483h-11.69V62.345h11.69V132.483z M210.414,54.552h-15.586c-2.154,0-3.897,1.743-3.897,3.897     v77.931c0,2.154,1.743,3.897,3.897,3.897h15.586v42.862H7.793v-0.001v-42.862h38.966c2.154,0,3.897-1.743,3.897-3.897V58.448     c0-2.154-1.743-3.897-3.897-3.897H7.793V35.069h202.621V54.552z" />
                        <circle cx="113" cy="163.655" r="7.793" />
                        <path d="M66.241,140.277h109.103c2.154,0,3.897-1.743,3.897-3.897V58.448c0-2.153-1.743-3.896-3.896-3.896H66.241     c-2.154,0-3.897,1.743-3.897,3.897v77.931C62.344,138.534,64.087,140.277,66.241,140.277z M70.138,62.345h101.31v70.138H70.138     V62.345z" />
                        <rect
                          x="66.241"
                          y="159.759"
                          width="11.69"
                          height="7.793"
                        />
                        <rect
                          x="85.724"
                          y="159.759"
                          width="11.69"
                          height="7.793"
                        />
                        <rect
                          x="128.586"
                          y="159.759"
                          width="11.69"
                          height="7.793"
                        />
                        <rect
                          x="148.069"
                          y="159.759"
                          width="11.69"
                          height="7.793"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
                <span className="ms-3">Add Display Slider</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14 ">
          {children}
        </div>
      </div>
      <LogoutModal isVisible={isVisible} onClose={onClose} logout={logout} />
    </main>
  );
};

export default Sidebar;

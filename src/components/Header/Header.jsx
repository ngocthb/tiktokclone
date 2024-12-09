import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faCircleXmark,
  faSpinner,
  faCircleCheck,
  faPlus,
  faChevronLeft,
  faUser,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { faMessage, faMoon } from "@fortawesome/free-regular-svg-icons";
import { faTiktok } from "@fortawesome/free-brands-svg-icons";
import {
  faHouseMedical,
  faGear,
  faLanguage,
  faCircleQuestion,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../config/axios";
import { loginUser, logoutUser } from "../../store/authSlice";
import { useSelector, useDispatch } from "react-redux";

import LoginModal from "../Login/LoginModal";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  // =========================Search================================
  const [searchValue, setSearchValue] = useState("");
  const [searchRst, setSearchRst] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const dropdownRef = useRef();

  // =========================Menu================================
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [currentMenu, setCurrentMenu] = useState("main"); // Track current menu (main or submenu)
  const [submenuIndex, setSubmenuIndex] = useState(null); // Track which submenu is open
  const hoverTimeoutRef = useRef();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLogin, setUserLogin] = useState(null);
  const [open, setOpen] = useState(false);
  const modalRef = useRef();

  const handleMouseEnterMenu = () => {
    clearTimeout(hoverTimeoutRef.current);
    setIsMenuVisible(true);
  };

  const handleMouseLeaveMenu = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsMenuVisible(false);
    }, 1000);
  };

  const goBackToMainMenu = () => {
    setCurrentMenu("main");
    setSubmenuIndex(null);
  };

  // =========================Search API Call================================
  const fetchSearchValue = async (q, type = "less") => {
    try {
      const res = await api.get(`/users/search`, { params: { q, type } });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (searchValue.trim()) {
      setLoading(true);
      fetchSearchValue(searchValue).then((data) => {
        setSearchRst(data.data || []);
        setLoading(false);
        setShowResult(true);
      });
    } else {
      setSearchRst([]);
    }
  }, [searchValue]);

  const handleClear = (e) => {
    e.stopPropagation();
    setSearchValue("");
    setSearchRst([]);
    setShowResult(false);
    inputRef.current.focus();
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (!value.startsWith(" ")) {
      setSearchValue(value);
    }
  };

  const handleClickOutside = (e) => {
    e.stopPropagation();
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      inputRef.current &&
      !inputRef.current.contains(e.target)
    ) {
      setShowResult(false);
    }
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { icon: faUser, label: "View Profile" },
    { icon: faTiktok, label: "Get Coins" },
    { icon: faHouseMedical, label: "Create Tools" },
    { icon: faGear, label: "Settings" },
    {
      icon: faLanguage,
      label: "Language",
      submenus: [{ label: "English" }, { label: "Spanish" }],
    },
    { icon: faCircleQuestion, label: "Feedback and help" },
    {
      icon: faMoon,
      label: "Dark Mode",
      submenus: [{ label: "Dark mode" }, { label: "Light mode" }],
    },
    { icon: faArrowRightFromBracket, label: "Log out" },
  ];

  const renderMenu = (items, level = 0) => {
    return (
      <ul className={`space-y-2 font-medium ${level > 0 ? "pl-4" : ""}`}>
        {items.map((item, index) => (
          <li
            key={index}
            className={`hover:bg-gray-100 p-2 cursor-pointer ${
              item.label === "Log out" ? "border-t" : ""
            }`}
            onClick={
              item.submenus
                ? () => {
                    setCurrentMenu("submenu");
                    setSubmenuIndex(index);
                  }
                : () => {
                    if (item.label === "Log out") {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Log out",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          Swal.fire({
                            title: "Logged out!",
                            text: "Your account has been logged out.",
                            icon: "success",
                          });
                          handelLogOut();
                        }
                      });
                    }
                    if (item.label === "View Profile") {
                      navigate(`/profile/${userLogin.nickname}`);
                    }
                  }
            }
          >
            <FontAwesomeIcon icon={item.icon} className="pr-2" />
            {item.label}
          </li>
        ))}
      </ul>
    );
  };

  // =========================Modal Login================================

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const authData = JSON.parse(sessionStorage.getItem("authData"));
    if (authData) {
      setUserLogin(authData);
      setIsLoggedIn(true);
    }
  }, []);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      console.log("User login:", user);
      setIsLoggedIn(true);
      setIsModalOpen(false);
      setUserLogin(user);
    }
  }, [user]);

  const handelLogOut = () => {
    setOpen(false);
    dispatch(logoutUser());
    setIsLoggedIn(false);
    setUserLogin(null);
  };

  return (
    <header className="font-grotesk grid grid-cols-5 items-center h-16 border-b">
      <div className="col-span-1">
        <img
          src="https://images.squarespace-cdn.com/content/v1/641692cb8c08c914772bb31d/7a56592b-a19d-433a-8ac5-dbf992d59d2c/TikTok-Logomark%26Wordmark-Logo.wine.jpg"
          alt="logo"
          className="h-8 px-4"
        />
      </div>
      <div className="col-span-3 flex justify-center items-center">
        <div className="relative w-[50%]" ref={dropdownRef}>
          <input
            ref={inputRef}
            value={searchValue}
            spellCheck={false}
            type="text"
            placeholder="Search accounts and videos"
            onChange={handleChange}
            className="w-full h-10 rounded-3xl pl-4 pr-10 bg-gray-100 outline-slate-500 focus:outline-none"
          />
          {!!searchValue && !loading && (
            <button onMouseDown={handleClear}>
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="absolute top-1/2 right-12 -translate-y-1/2 text-gray-300 h-3"
              />
            </button>
          )}
          {loading && (
            <button>
              <FontAwesomeIcon
                icon={faSpinner}
                className="absolute top-1/2 right-12 -translate-y-1/2 text-gray-300 h-3 animate-spin"
              />
            </button>
          )}
          <button
            className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center border-l border-gray-300 pl-2 hover:bg-gray-200 rounded-r-3xl p-1"
            onClick={() => setShowResult(true)}
          >
            <FontAwesomeIcon icon={faSearch} className="text-gray-300" />
          </button>
          {showResult && searchValue && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-2 z-50 ">
              <h4 className="font-medium p-3 text-gray-400">Accounts</h4>
              {searchRst.map((item, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
                >
                  <img
                    src={item.avatar}
                    alt="avatar"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="flex-col ">
                    <h2 className="font-medium">
                      {item.full_name}{" "}
                      {item.tick && (
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          className="text-blue-500"
                        />
                      )}
                    </h2>
                    <h4>{item.nickname}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="col-span-1">
        <div className="flex items-center justify-between w-[40%]">
          {!isLoggedIn && (
            <>
              <button
                className="flex h-9 w-34 rounded-lg items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600"
                onClick={handleOpenModal}
              >
                <h4 className="text-white font-medium text-center">Log in</h4>
              </button>
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </>
          )}
        </div>
        {isLoggedIn && (
          <div className="flex items-center justify-between w-[80%]">
            <button className="flex h-9 w-34 items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-100">
              <FontAwesomeIcon icon={faPlus} />
              <h4 className="font-medium">Upload</h4>
            </button>
            <FontAwesomeIcon
              icon={faMessage}
              className="text-2xl cursor-pointer"
            />
            <div
              className="relative"
              onMouseEnter={handleMouseEnterMenu}
              onMouseLeave={handleMouseLeaveMenu}
            >
              <img
                src={userLogin.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              {isMenuVisible && (
                <div className="absolute top-full right-0 w-52 bg-white shadow-lg rounded-md mt-2 z-50 p-2 font-normal">
                  {currentMenu === "main" && renderMenu(menuItems)}
                  {currentMenu === "submenu" && (
                    <div className="p-2">
                      <button
                        onClick={goBackToMainMenu}
                        className="flex items-center mb-3 space-x-2 text-gray-500 hover:text-black"
                      >
                        <FontAwesomeIcon icon={faChevronLeft} />
                        <span>Back</span>
                      </button>
                      {renderMenu(menuItems[submenuIndex].submenus || [])}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <LoginModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
    </header>
  );
}

export default Header;

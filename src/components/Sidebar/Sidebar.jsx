import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom";
import {
  faHouse,
  faCompass,
  faUserGroup,
  faVideo,
  faUser,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import LoginModal from "../Login/LoginModal";
import { useSelector } from "react-redux";
import api from "../../config/axios";

function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLogin, setUserLogin] = useState(null);

  const [follower, setFollower] = useState([]);
  const [listOfFollower, setListOfFollower] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

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

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      setIsModalOpen(false);
      setUserLogin(user.data);
    }
  }, [user]);

  useEffect(() => {
    const originalSetItem = sessionStorage.setItem;
    const originalRemoveItem = sessionStorage.removeItem;

    sessionStorage.removeItem = (key) => {
      setIsLoggedIn(false);
      originalRemoveItem.call(sessionStorage, key);
    };

    return () => {
      sessionStorage.setItem = originalSetItem;
      sessionStorage.removeItem = originalRemoveItem;
    };
  }, []);

  const fetchAccountsValue = async () => {
    try {
      const res = await api.get(`me/followings?page=${page}`);
      const data = res.data.data;
      setFollower(data);
      setListOfFollower((prevList) => {
        const updatedList = [...prevList, ...data];
        const uniqueFollowers = updatedList.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.id === value.id)
        );

        return uniqueFollowers;
      });
      setPagination(res.data.meta.pagination);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAccountsValue();
    }
  }, [page, isLoggedIn]);

  const handlePageChange = async () => {
    console.log("page", pagination);
    if (page >= pagination.total_pages) {
      const updatedListOfFollowers = listOfFollower.filter(
        (item) => !follower.some((f) => f.id === item.id)
      );
      setListOfFollower(updatedListOfFollowers);
      setPage((pre) => pre - 1);
    } else {
      setPage((pre) => pre + 1);
    }
  };

  return (
    <div>
      <ul className="font-medium  border-b">
        <li className="p-3 text-xl">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "text-red-500" : "")}
          >
            <FontAwesomeIcon icon={faHouse} className="pr-4" />
            For You
          </NavLink>
        </li>
        <li className="p-3 text-xl">
          <NavLink
            to="/explore"
            className={({ isActive }) => (isActive ? "text-red-500" : "")}
          >
            <FontAwesomeIcon icon={faCompass} className="pr-4" />
            Explore
          </NavLink>
        </li>
        <li className="p-3 text-xl">
          <NavLink
            to="/following"
            className={({ isActive }) => (isActive ? "text-red-500" : "")}
          >
            <FontAwesomeIcon icon={faUserGroup} className="pr-4" />
            Following
          </NavLink>
        </li>
        <li className="p-3 text-xl">
          <NavLink
            to="/live"
            className={({ isActive }) => (isActive ? "text-red-500" : "")}
          >
            <FontAwesomeIcon icon={faVideo} className="pr-4" />
            Live
          </NavLink>
        </li>
        <li className="p-3 text-xl">
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "text-red-500" : "")}
          >
            <FontAwesomeIcon icon={faUser} className="pr-4" />
            Profile
          </NavLink>
        </li>
      </ul>

      {isLoggedIn ? (
        <div>
          <h1 className="p-2 text-sm font-semibold text-gray-600">
            Following accounts
          </h1>
          {(listOfFollower || []).map((item) => (
            <div key={item.id} className="grid grid-cols-4 p-1">
              <img
                className="col-span-1 rounded-full w-12 h-12 object-cover mt-1"
                src={item.avatar}
              />
              <div className="flex-col col-span-3 pl-1">
                <h2 className="font-medium w-32 overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.nickname}{" "}
                  {item.tick && (
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="text-blue-500"
                    />
                  )}
                </h2>
                <h4 className=" w-30 overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.first_name} {item.last_name}
                </h4>
              </div>
            </div>
          ))}
          <h1
            className="p-2 text-sm font-semibold text-red-500 cursor-pointer"
            onClick={handlePageChange}
          >
            {page >= pagination.total_pages ? "See less" : "See more"}
          </h1>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center p-2">
          <h1 className="text-lg py-1 px-3 text-gray-600 mb-2">
            Log in to follow creators, like videos, and view comments.
          </h1>
          <button
            className="border w-full h-12 border-red-500 text-red-500 font-medium py-1 px-4 rounded hover:bg-gray-100 text-xl mb-4"
            onClick={() => handleOpenModal()}
          >
            Log in
          </button>
        </div>
      )}
      <div className="flex flex-col justify-center items-center p-2 border-t">
        <ul className="space-y-3">
          <Link
            to="https://effecthouse.tiktok.com/download?utm_campaign=ttweb_entrance_v1&utm_source=tiktok_webapp_main"
            className="grid grid-cols-5 bg-[url('https://sf16-website-login.neutral.ttwstatic.com/obj/tiktok_web_login_static/tiktok/webapp/main/webapp-desktop-islands/021d2ed936cbb9f7033f.png')] 
               bg-cover bg-center rounded-lg mb-3 border border-gray-200 hover:shadow-lg transition"
          >
            <h4 className="col-span-4 font-medium p-3 text-xs rounded-l-lg">
              Create TikTok effects, get a reward
            </h4>
          </Link>

          <li className="font-bold text-sm text-gray-500">Company</li>
          <li className="font-bold text-sm text-gray-500">Program</li>
          <li className="font-bold text-sm text-gray-500">Terms & Policies</li>
          <li className="font-medium text-xs text-gray-500">© 2024 TikTok</li>
        </ul>
      </div>
      <LoginModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
    </div>
  );
}

export default Sidebar;

// function useLocalStorageLogger() {
//   useEffect(() => {
//     // Ghi đè vào localStorage.setItem để theo dõi thay đổi trong cùng một tab
//     const originalSetItem = localStorage.setItem;
//     const originalRemoveItem = localStorage.removeItem;

//     // Ghi đè vào setItem để log giá trị mới
//     localStorage.setItem = (key, value) => {
//       const oldValue = localStorage.getItem(key);
//       console.log(`Key changed: ${key}`);
//       console.log(`Old value: ${oldValue}`);
//       console.log(`New value: ${value}`);

//       // Thực hiện hành động setItem gốc
//       originalSetItem.call(localStorage, key, value);
//     };

//     // Ghi đè vào removeItem để log khi item bị xóa
//     localStorage.removeItem = (key) => {
//       const oldValue = localStorage.getItem(key);
//       console.log(`Key removed: ${key}`);
//       console.log(`Old value: ${oldValue}`);

//       // Thực hiện hành động removeItem gốc
//       originalRemoveItem.call(localStorage, key);
//     };

//     // Lắng nghe sự kiện thay đổi từ các tab khác
//     const handleStorageChange = (event) => {
//       if (event.key) {
//         console.log(`Key changed in another tab: ${event.key}`);
//         console.log(`Old value: ${event.oldValue}`);
//         console.log(`New value: ${event.newValue}`);
//       }
//     };

//     window.addEventListener("storage", handleStorageChange);

//     // Cleanup khi component bị hủy
//     return () => {
//       localStorage.setItem = originalSetItem;
//       localStorage.removeItem = originalRemoveItem;
//       window.removeEventListener("storage", handleStorageChange);
//     };
//   }, []);
// }

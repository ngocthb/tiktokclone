import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faHeart } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useRef } from "react";
import api from "../../config/axios";
import LoginModal from "../Login/LoginModal";
import { useSelector } from "react-redux";
import Video from "../Video/Video";

export default function Following() {
  const [listFollowing, setListFollowing] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const scrollableContainerRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLogin, setUserLogin] = useState(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const fetchFollowing = async () => {
    try {
      const res = await api.get(`users/suggested?page=${page}&per_page=8`);
      const data = res.data.data;
      setListFollowing((prevList) => {
        const updatedList = [...prevList, ...data];
        const uniqueFollowing = updatedList.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.id === value.id)
        );

        return uniqueFollowing;
      });
      setPagination(res.data.meta.pagination);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      fetchFollowing();
    }
  }, [page]);

  const handleScroll = () => {
    const container = scrollableContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      if (page < pagination.total_pages) {
        setPage((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    const container = scrollableContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    if (listFollowing.length > 0) {
      handleScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [listFollowing]);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const authData = JSON.parse(sessionStorage.getItem("authData"));
    if (authData) {
      setUserLogin(authData);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      setIsModalOpen(false);
      setUserLogin(user.data);
    }
  }, [user]);

  return (
    <div
      ref={scrollableContainerRef}
      className="col-span-3 flex flex-col space-y-5 overflow-y-scroll"
      style={{ height: "88vh" }}
    >
      {isLoggedIn ? (
        <Video type="following" />
      ) : (
        <div className="grid grid-cols-3 px-10 py-5 gap-4">
          {(listFollowing || []).map((item) => (
            <div
              key={item.id}
              className="col-span-1 relative flex flex-col items-center justify-end py-5 h-96"
            >
              <video
                className="absolute inset-0 w-full object-cover h-full z-0 rounded-lg"
                src={item.popular_video.file_url}
                autoPlay
                loop
                muted
              />

              <div className="absolute inset-0 bg-black bg-opacity-30 z-10 rounded-lg"></div>

              <div className="relative z-20 flex flex-col items-center ">
                <img
                  className="rounded-full w-16 h-16 object-cover border-2 border-white"
                  src={item.avatar}
                  alt="Avatar"
                />{" "}
                <h4 className="w-30 text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap text-center">
                  {item.first_name} {item.last_name}
                </h4>
                <h2 className="font-medium w-32 text-white overflow-hidden text-ellipsis whitespace-nowrap text-center mt-2">
                  {item.nickname}{" "}
                  {item.tick && (
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="text-blue-500"
                    />
                  )}
                </h2>
                <button
                  className="mt-2 bg-red-500 text-white px-9 py-2 rounded-sm font-semibold"
                  onClick={() => handleOpenModal()}
                >
                  Following
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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

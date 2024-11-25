import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/authSlice";
import DefaultModal from "../DefaultModal/DefaultModal";
function LoginModal({
  isOpen,
  onClose,
  email,
  setEmail,
  password,
  setPassword,
}) {
  const [modal, setModal] = useState("login");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const handleLogin = () => {
    dispatch(loginUser(email, password));
  };

  if (!isOpen) return null;

  const checkPassword = () => {
    if (password !== confirmPassword) {
      <DefaultModal />;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      {modal === "login" && (
        <div className="bg-white rounded-lg p-6 w-96 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500"
          >
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
          <h2 className="text-2xl font-bold mb-4">Log In</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <div className="p-3">
            Don't have an account yet?{"  "}
            <span
              className="text-red-500 cursor-pointer font-bold"
              onClick={() => setModal("signup")}
            >
              Sign up
            </span>
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={() => handleLogin()}
              className="w-full bg-red-500 text-white py-2 rounded-md"
            >
              Log In
            </button>
            <button onClick={onClose} className="ml-4 py-2 text-gray-600">
              Cancel
            </button>
          </div>
        </div>
      )}
      {modal === "signup" && (
        <div className="bg-white rounded-lg p-6 w-96 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500"
          >
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>

          <h2 className="text-2xl font-bold mb-4">Register </h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <div className="flex justify-between items-center">
            <button
              onClick={() => handleLogin()}
              className="w-full bg-red-500 text-white py-2 rounded-md"
            >
              Log In
            </button>
            <button
              onClick={() => checkPassword()}
              className="ml-4 py-2 text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginModal;

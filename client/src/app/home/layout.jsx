"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setOnlineUser,
  setSocketConnection,
  setToken,
  setUser,
} from "../../store/redux/userSlice";
import io from "socket.io-client";
import Sidebar from "../../components/Sidebar";

const HomeLayout = ({ children }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    const parsedUser = JSON.parse(userData);
    if (user._id === "") {
      dispatch(setUser(parsedUser));
      dispatch(setToken(token));
    }
  }, [dispatch, user]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("no token found");
      return;
    }
    const socketConnection = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      auth: {
        token: token,
      },
    });
    socketConnection.on("onlineUser", (data) => {
      dispatch(setOnlineUser({ onlineUser: data }));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, [dispatch]);
  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className="bg-white lg:block">
        <Sidebar />
      </section>

      {children}
    </div>
  );
};

export default HomeLayout;

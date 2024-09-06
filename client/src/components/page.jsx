"use client";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  setOnlineUser,
  setSocketConnection,
  setUser,
} from "../../store/redux/userSlice";
import io from "socket.io-client";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import logo from "../../public/assets/logo.png";

const Page = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-details`;
        const response = await axios({
          url: URL,
          withCredentials: true,
        });

        if (response.data.data.logout) {
          dispatch(logout());
          router.push("/check-mail");
        } else {
          dispatch(setUser(response.data.data));
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUserDetails();
  }, [dispatch, router]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    const socketConnection = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      auth: {
        token,
      },
    });

    socketConnection.on("onlineUser", (data) => {
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, [dispatch]);

  const isBasePath = pathname === "/home";

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      {isBasePath && (
        <section className="bg-white lg:block">
          <Sidebar />
        </section>
      )}

      <div
        className={`justify-center items-center flex-col gap-2 hidden lg:flex ${
          isBasePath ? "" : "lg:hidden"
        }`}
      >
        <div>
          <Image src={logo} width={250} alt="logo" />
        </div>
        <p className="text-lg mt-2 text-slate-500">
          Select user to send message
        </p>
      </div>
    </div>
  );
};

export default Page;

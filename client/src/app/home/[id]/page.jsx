"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaPlus, FaImage, FaVideo } from "react-icons/fa6";
import uploadFile from "../../../lib/uploadFile";
import { IoClose } from "react-icons/io5";
import Loading from "../../../components/Loading";
import { IoMdSend } from "react-icons/io";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import Avatar from "../../../components/Avatar";

const Page = ({ params }) => {
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );

  const user = useSelector((state) => state?.user);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });

  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);

  const formik = useFormik({
    initialValues: {
      text: "",
      imageUrl: "",
      videoUrl: "",
    },
    onSubmit: (values, { resetForm }) => {
      if (values.text || values.imageUrl || values.videoUrl) {
        if (socketConnection) {
          socketConnection.emit("new-message", {
            sender: user?._id,
            receiver: params.id,
            text: values.text,
            imageUrl: values.imageUrl,
            videoUrl: values.videoUrl,
            msgByUserId: user?._id,
          });
          resetForm();
        }
      }
    },
  });

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.id);
      socketConnection.emit("seen", params.id);
      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });
      socketConnection.on("messages", (data) => {
        setAllMessage(data);
      });
    }
  }, [params.id, socketConnection]);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((prev) => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);
    formik.setFieldValue("imageUrl", uploadPhoto.url);
  };

  const handleClearUploadImage = () => {
    formik.setFieldValue("imageUrl", "");
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);
    formik.setFieldValue("videoUrl", uploadPhoto.url);
  };

  const handleClearUploadVideo = () => {
    formik.setFieldValue("videoUrl", "");
  };

  return (
    <div className="custom-background bg-no-repeat bg-cover ">
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link href={"/home"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1 mb-1">
              {dataUser?.name}
            </h3>
            <p className="-my-2 text-sm">
              {dataUser.online ? (
                <span className="text-primary">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <button className="cursor-pointer hover:text-primary">
            <HiDotsVertical />
          </button>
        </div>
      </header>

      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
        <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
          {allMessage.map((msg, index) => (
            <div
              key={index}
              className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
                user._id === msg?.msgByUserId
                  ? "ml-auto bg-teal-100"
                  : "bg-white"
              }`}
            >
              <div className="w-full relative">
                {msg?.imageUrl && (
                  <Image
                    src={msg?.imageUrl}
                    className="w-full h-full object-scale-down"
                    alt="message"
                    width="auto"
                    height="auto"
                  />
                )}
                {msg?.videoUrl && (
                  <video
                    src={msg.videoUrl}
                    className="w-full h-full object-scale-down"
                    controls
                  />
                )}
              </div>
              <p className="px-2">{msg.text}</p>
              <p className="text-xs ml-auto w-fit">
                {moment(msg.createdAt).format("hh:mm")}
              </p>
            </div>
          ))}
        </div>

        {formik.values.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadImage}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <Image
                src={formik.values.imageUrl}
                alt="uploadImage"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                width={200}
                height={200}
              />
            </div>
          </div>
        )}

        {formik.values.videoUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadVideo}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <video
                src={formik.values.videoUrl}
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
            <Loading />
          </div>
        )}
      </section>

      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative">
          <button
            onClick={handleUploadImageVideoOpen}
            className="flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white"
          >
            <FaPlus size={20} />
          </button>

          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-primary">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-purple-500">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>

                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                />

                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="w-full h-10 flex items-center"
        >
          <input
            name="text"
            id="text"
            placeholder="Aa"
            value={formik.values.text}
            onChange={formik.handleChange}
            className="bg-slate-200 h-full w-full rounded-2xl outline-none px-3"
          />
          <button type="submit" className="p-2">
            <IoMdSend
              className={`w-6 h-6 ${
                formik.values.text ||
                formik.values.imageUrl ||
                formik.values.videoUrl
                  ? "text-primary"
                  : "text-slate-400"
              }`}
            />
          </button>
        </form>
      </section>
    </div>
  );
};

export default Page;

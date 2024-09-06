import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import { BiLogOut } from "react-icons/bi";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { FiArrowUpLeft } from "react-icons/fi";
import { logout } from "../store/redux/userSlice";
import { useRouter } from "next/navigation";
import EditUserDetails from "./EditUserDetails";
import SearchUser from "./SearchUser";

const Sidebar = () => {
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state.user);
  const [allUsers, setAllUsers] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);
      socketConnection.on("conversation", (data) => {
        const conversationsData = data.map((conversationUser) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        });

        setAllUsers(conversationsData);
      });
    }
  }, [socketConnection, user]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/check-mail");
  };

  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
      <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
        <div className="">
          <Link
            href={""}
            className={`m-auto w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${"bg-slate-200"}`}
          >
            <IoChatbubbleEllipses size={20} />
          </Link>

          <button
            className="m-auto w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded "
            onClick={() => setOpenSearchUser(true)}
          >
            {" "}
            <FaUserPlus size={20} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center">
          <button className="mx-auto" onClick={() => setEditUserOpen(true)}>
            <Avatar
              width={50}
              height={50}
              name={user?.name}
              imageUrl={user?.profile_pic}
              userId={user?._id}
            />
          </button>
          <button onClick={handleLogout}>
            <span className="-ml-2">
              <BiLogOut size={20} />
            </span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="h-16 flex items-center">
          <h2 className="text-xl font-bold p-4 text-slate-800">Message</h2>
        </div>
        <div className="bg-slate-200 p-[0.5px]"></div>

        <div className=" h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {allUsers.length === 0 && (
            <div className="mt-12">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <FiArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore users to start a conversation with.
              </p>
            </div>
          )}

          {allUsers.map((conv, index) => {
            return (
              <Link
                href={"/home/" + conv?.userDetails?._id}
                key={conv?._id}
                className="flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer"
              >
                <div>
                  <Avatar
                    imageUrl={conv?.userDetails?.profile_pic}
                    name={conv?.userDetails?.name}
                    width={50}
                    height={50}
                  />
                </div>
                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">
                    {conv?.userDetails?.name}
                  </h3>
                  <div className="text-slate-500 text-xs flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      {conv?.lastMsg?.imageUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaImage />
                          </span>
                          {!conv?.lastMsg?.text && <span>Image</span>}
                        </div>
                      )}
                      {conv?.lastMsg?.videoUrl && (
                        <div className="flex items-center gap-1 ">
                          <span>
                            <FaVideo />
                          </span>
                          {!conv?.lastMsg?.text && <span>Video</span>}
                        </div>
                      )}
                    </div>
                    <p className="w-36 text-ellipsis line-clamp-1">
                      {conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>
                {Boolean(conv?.unReadMsgs) && (
                  <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full">
                    {conv?.unReadMsgs}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {/**search user */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;

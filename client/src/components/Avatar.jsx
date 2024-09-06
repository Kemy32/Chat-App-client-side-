import Image from "next/image";
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from "react-redux";
const Avatar = ({ userId, name, imageUrl, width, height }) => {
  const { onlineUser } = useSelector((state) => state.user);
  let avatarName = "";
  if (name) {
    const splitName = name.split("");
    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
  }
  const bgColor = [
    "bg-slate-200",
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-gray-200",
    "bg-cyan-200",
    "bg-sky-200",
    "bg-blue-200",
  ];
  const randomNumber = Math.floor(Math.random() * 9);
  const isOnline = onlineUser.includes(userId);
  return (
    <div>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          width={width}
          height={height}
          priority={false}
          className="overflow-hidden rounded-full m-auto"
        />
      ) : name ? (
        <div
          className={`overflow-hidden rounded-full flex justify-center items-center text-md p-2 ${bgColor[randomNumber]}`}
        >
          {" "}
          {avatarName}
        </div>
      ) : (
        <PiUserCircle size={width} />
      )}

      {isOnline && (
        <div className="bg-green-600 p-1 absolute bottom-[4.25rem] left-[2rem] z-10 rounded-full"></div>
      )}
    </div>
  );
};

export default Avatar;

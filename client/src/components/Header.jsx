import Image from "next/image";
import logo from "../../public/assets/images/AMIT.png";
const HeaderComponent = () => {
  return (
    <header className="flex justify-center items-center py-2 h-16 shadow-md bg-white">
      <Image src={logo} alt="logo" width={150} height={40} priority={true} />
    </header>
  );
};

export default HeaderComponent;

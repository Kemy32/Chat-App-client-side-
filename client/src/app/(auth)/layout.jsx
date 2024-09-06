import HeaderComponent from "../../components/Header";
import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <>
      <HeaderComponent />
      {children}
    </>
  );
};

export default AuthLayout;

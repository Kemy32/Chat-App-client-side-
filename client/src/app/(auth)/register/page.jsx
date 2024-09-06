"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoClose } from "react-icons/io5";
import { useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { register } from "../../../network/user.api";
import { useRouter } from "next/navigation";
const Page = () => {
  const [uploadPhoto, setUploadPhoto] = useState();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      profile_pic: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is Required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is Required"),
      password: Yup.string().required("Password is Required"),
    }),
    onSubmit: async (values) => {
      try {
        const result = await register(values);
        if (result.data.success) {
          toast.success(result.data.message);
          formik.resetForm();
          setUploadPhoto(null);
          router.push("/check-mail");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Registration failed");
      }
    },
  });

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } =
    formik;

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadPhoto(file);
      formik.setFieldValue("profile_pic", file);
    }
  };

  const handleClearUploadPhoto = (e) => {
    e.preventDefault();
    setUploadPhoto(null);
    formik.setFieldValue("profile_pic", "");
  };

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <div className="mt-4 flex justify-center items-center w-full h-full">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto shadow-md mt-8">
        <h3 className="w-full text-center text-primary font-semibold text-2xl mb-5  ">
          Welcome to Amit Chat App!
        </h3>
        <form onSubmit={handleSubmit} className="grid gap-4 mt-5">
          <div className="flex flex-col gap-1 mb-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={values["name"]}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {touched["name"] && errors["name"] ? (
              <div className="text-red-500 text-sm">{errors["name"]}</div>
            ) : null}
          </div>
          <div className="flex flex-col gap-1 mb-1">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={values["email"]}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {touched["email"] && errors["email"] ? (
              <div className="text-red-500 text-sm">{errors["email"]}</div>
            ) : null}
          </div>
          <div className="flex flex-col gap-1 mb-1">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={values["password"]}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {touched["password"] && errors["password"] ? (
              <div className="text-red-500 text-sm">{errors["password"]}</div>
            ) : null}
          </div>
          <div className="flex flex-col gap-1 mb-1">
            <label htmlFor="profile_pic">Photo:</label>
            <div className="h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer">
              <p
                className="text-sm max-w-[300px] text-ellipsis line-clamp-1"
                onClick={handleFileButtonClick}
              >
                {uploadPhoto?.name || "Upload Profile Image"}{" "}
              </p>
              {uploadPhoto && (
                <button
                  className="text-lg ml-2 hover:text-red-600"
                  onClick={handleClearUploadPhoto}
                >
                  <IoClose />
                </button>
              )}
              <input
                type="file"
                name="profile_pic"
                id="profile_pic"
                className="hidden"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!formik.dirty || !formik.isValid}
            className="bg-primary text-lg px-4 disabled:bg-secondary hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide"
          >
            Register
          </button>
        </form>

        <p className="my-3 text-center">
          Already have an account ?
          <Link
            href={"/check-mail"}
            className="text-primary hover:text-secondary font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;

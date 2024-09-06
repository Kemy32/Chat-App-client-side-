"use client";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { checkPassword } from "../../../network/user.api";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../../../store/redux/userSlice";
const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      const parsedData = JSON.parse(data);
      setUserData(parsedData);
    } else {
      router.push("/check-mail");
    }
  }, [router, searchParams]);

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Password is Required"),
    }),
    onSubmit: async (values) => {
      try {
        const result = await checkPassword({
          ...values,
          userId: userData._id,
        });

        if (result.data.success) {
          toast.success(result.data.message);
          formik.resetForm();
          dispatch(setToken(result?.data?.token));
          localStorage.setItem("token", result?.data?.token);
          router.push(`/home`);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    },
  });

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } =
    formik;
  return (
    <div className="mt-4 flex justify-center items-center w-full h-full">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto shadow-md mt-8">
        <h3 className="w-full text-center text-primary font-semibold text-2xl mb-5  ">
          Welcome to Amit Chat App!
        </h3>
        <form onSubmit={handleSubmit} className="grid gap-4 mt-5">
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

          <button
            type="submit"
            disabled={!formik.dirty || !formik.isValid}
            className="bg-primary text-lg px-4 disabled:bg-secondary hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide"
          >
            Login
          </button>
        </form>

        <p className="my-3 text-center">
          <Link
            href={"/register"}
            className="text-primary hover:text-secondary font-semibold"
          >
            Forgot password ?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;

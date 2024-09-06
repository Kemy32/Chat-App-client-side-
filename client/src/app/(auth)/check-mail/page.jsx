"use client";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { checkMail } from "../../../network/user.api";
import { useRouter } from "next/navigation";
import queryString from "query-string";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/redux/userSlice";
const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is Required"),
    }),
    onSubmit: async (values) => {
      try {
        const result = await checkMail(values);
        console.log(result);

        if (result.data.success) {
          toast.success(result.data.message);
          formik.resetForm();
          const queryParams = queryString.stringify({
            data: JSON.stringify(result?.data?.data),
          });
          localStorage.setItem("user", JSON.stringify(result?.data?.data));
          dispatch(setUser(result?.data?.data));
          router.push(`/check-password?${queryParams}`);
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

          <button
            type="submit"
            disabled={!formik.dirty || !formik.isValid}
            className="bg-primary text-lg px-4 disabled:bg-secondary hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide"
          >
            Let&apos;s GO
          </button>
        </form>

        <p className="my-3 text-center">
          New User ?
          <Link
            href={"/register"}
            className="text-primary hover:text-secondary font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;

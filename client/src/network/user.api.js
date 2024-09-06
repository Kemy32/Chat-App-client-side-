const { axiosInstance } = require("./index");

const register = async (data) => {
  return await axiosInstance.post("/api/register", data);
};

const checkMail = async (data) => {
  return await axiosInstance.post("/api/email", data);
};

const checkPassword = async (data) => {
  return await axiosInstance.post("/api/password", data);
};

const getSearchUser = async (data) => {
  const { token, ...rest } = data;
  return await axiosInstance.post("/api/search-user", rest, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
};
export { register, checkMail, checkPassword, getSearchUser };

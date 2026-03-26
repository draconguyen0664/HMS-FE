import axiosInstance from "../Interceptor/AxiosInterceptor";

const registerUser = async (user: {
  name: string;
  role: string;
  email: string;
  password: string;
}) => {
  try {
    console.log("register payload:", user);
    const response = await axiosInstance.post("/user/register", user);
    return response.data;
  } catch (error: any) {
    console.log("register error status:", error?.response?.status);
    console.log("register error data:", error?.response?.data);
    console.log("register error full:", error);
    throw error;
  }
};

const loginUser = async (user: { email: string; password: string }) => {
  try {
    const response = await axiosInstance.post("/user/login", user);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export { registerUser, loginUser };

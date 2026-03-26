import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:9000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const url = config.url || "";

    const isPublicApi =
      url.includes("/user/login") || url.includes("/user/register");

    if (token && !isPublicApi) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
    } else {
      console.error("Network/Error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

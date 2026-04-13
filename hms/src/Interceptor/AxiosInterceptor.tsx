import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:9000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const rawToken =
      localStorage.getItem("token") || localStorage.getItem("accessToken");

    const token = rawToken?.startsWith("Bearer ")
      ? rawToken.replace("Bearer ", "")
      : rawToken;

    const url = config.url || "";

    const publicApis = [
      "/user/login",
      "/user/register",
      "/profile/doctor/dropdowns",
    ];

    const isPublicApi = publicApis.some((path) => url.includes(path));

    config.headers = config.headers ?? {};

    if (!isPublicApi && token) {
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

      if (error.response.status === 401) {
        console.warn("Unauthorized request. Check token or backend security.");
      }
    } else {
      console.error("Network/Error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

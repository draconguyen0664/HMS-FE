import axiosInstance from "../Interceptor/AxiosInterceptor";

const getDoctor = async (id: string | number) => {
  if (id === undefined || id === null || id === "") {
    throw new Error("Doctor id is required");
  }

  const response = await axiosInstance.get(`/profile/doctor/get/${id}`);
  return response.data;
};

const getDoctorDropdown = async () => {
  const response = await axiosInstance.get("/profile/doctor/dropdowns");
  return response.data;
};

const updateDoctor = async (doctor: any) => {
  const response = await axiosInstance.put("/profile/doctor/update", doctor);
  return response.data;
};

export { getDoctor, getDoctorDropdown, updateDoctor };

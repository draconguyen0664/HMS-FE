import axios from "axios";

const getDoctor = async (id: string | number) => {
  if (id === undefined || id === null || id === "") {
    throw new Error("Doctor id is required");
  }

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `http://localhost:9100/profile/doctor/get/${id}`,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    },
  );

  return response.data;
};

const updateDoctor = async (doctor: any) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    "http://localhost:9100/profile/doctor/update",
    doctor,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    },
  );

  return response.data;
};

export { getDoctor, updateDoctor };

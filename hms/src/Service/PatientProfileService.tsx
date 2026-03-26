import axios from "axios";

const getPatient = async (id: string | number) => {
  if (id === undefined || id === null || id === "") {
    throw new Error("Patient id is required");
  }

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `http://localhost:9100/profile/patient/get/${id}`,
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

const updatePatient = async (patient: any) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    "http://localhost:9100/profile/patient/update",
    patient,
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

export { getPatient, updatePatient };

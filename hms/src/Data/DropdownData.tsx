// const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const bloodGroups = [
  { value: "A_POSITIVE", label: "A+" },
  { value: "A_NEGATIVE", label: "A-" },
  { value: "B_POSITIVE", label: "B+" },
  { value: "B_NEGATIVE", label: "B-" },
  { value: "O_POSITIVE", label: "O+" },
  { value: "O_NEGATIVE", label: "O-" },
  { value: "AB_POSITIVE", label: "AB+" },
  { value: "AB_NEGATIVE", label: "AB-" },
];
const doctorSpecializations = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "General Surgery",
  "Psychiatry",
  "Radiology",
  "Gynecology",
  "Ophthalmology",
];
const doctorDepartments = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "Surgery",
  "Psychiatry",
  "Radiology",
  "Gynecology",
  "Ophthalmology",
  "ENT",
  "Anesthesiology",
  "Pathology",
  "Emergency Medicine",
];

const appointmentReasons = [
  "General Consultation",
  "Follow-up Visit",
  "Prescription Refill",
  "Lab Results Review",
  "Chronic Condition Management",
  "Mental Health Counseling",
  "Pre-Surgery Consultation",
  "Post-Surgery Follow-up",
  "Vaccination",
  "Routine Checkup",
  "Diagnostic Test",
  "Second Opinion",
  "Physical Examination",
];

export {
  bloodGroups,
  doctorSpecializations,
  doctorDepartments,
  appointmentReasons,
};

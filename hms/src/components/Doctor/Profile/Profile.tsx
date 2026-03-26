import {
  Avatar,
  Button,
  Divider,
  Modal,
  NumberInput,
  Select,
  Table,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  doctorDepartments,
  doctorSpecializations,
} from "../../../Data/DropdownData";
import { useDisclosure } from "@mantine/hooks";
import { getDoctor, updateDoctor } from "../../../Service/DoctorProfileService";
import { formatDate } from "../../../Utility/DateUtility";
import { useForm } from "@mantine/form";
import { errorNotification } from "../../../Utility/NotificationUtil";

interface RootState {
  user: {
    name?: string;
    email?: string;
    profileId?: string | number;
    [key: string]: any;
  };
}

const Profile = () => {
  const user = useSelector((state: RootState) => state.user);
  const [editMode, setEdit] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      dob: null as Date | null,
      phone: "",
      address: "",
      licenseNo: "",
      specialization: "",
      department: "",
      totalExp: 0 as number | string,
    },

    validate: {
      dob: (value) => (!value ? "Date of Birth is required" : undefined),
      phone: (value) => (!value ? "Phone number is required" : undefined),
      address: (value) => (!value ? "Address is required" : undefined),
      licenseNo: (value) => (!value ? "License number is required" : undefined),
      specialization: (value) =>
        !value ? "Specialization is required" : undefined,
      department: (value) => (!value ? "Department is required" : undefined),
      totalExp: (value) =>
        value === "" || value === null || value === undefined
          ? "Total experience is required"
          : undefined,
    },
  });

  const fillFormFromProfile = (data: any) => {
    form.setValues({
      dob: data?.dob ? new Date(data.dob) : null,
      phone: data?.phone ? String(data.phone) : "",
      address: data?.address || "",
      licenseNo: data?.licenseNo ? String(data.licenseNo) : "",
      specialization: data?.specialization || "",
      department: data?.department || "",
      totalExp:
        data?.totalExp !== undefined && data?.totalExp !== null
          ? Number(data.totalExp)
          : 0,
    });
  };

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      if (!user?.profileId) return;

      try {
        setLoading(true);

        const data = await getDoctor(user.profileId);
        setProfile(data || {});
        fillFormFromProfile(data || {});
      } catch (error: any) {
        console.log(
          "get doctor profile error:",
          error?.response?.data || error,
        );

        if (error?.response?.status === 401) {
          errorNotification("Unauthorized - vui lòng đăng nhập lại");
        } else {
          errorNotification(
            error?.response?.data?.errorMessage ||
              "Không lấy được thông tin bác sĩ",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [user?.profileId]);

  const handleEdit = () => {
    fillFormFromProfile(profile || {});
    setEdit(true);
  };

  const handleCancelEdit = () => {
    fillFormFromProfile(profile || {});
    setEdit(false);
  };

  const handleSubmit = async (values: any) => {
    if (!user?.profileId && !profile?.id) {
      errorNotification("Không tìm thấy mã bác sĩ");
      return;
    }

    const payload = {
      ...profile,
      ...values,
      id: profile?.id || user?.profileId,
      dob: values.dob ? new Date(values.dob).toISOString().split("T")[0] : null,
      phone: values.phone ? String(values.phone) : "",
      licenseNo: values.licenseNo ? String(values.licenseNo) : "",
      totalExp:
        values.totalExp !== undefined && values.totalExp !== null
          ? Number(values.totalExp)
          : 0,
    };

    try {
      console.log("doctor update payload:", payload);

      const data = await updateDoctor(payload);
      setProfile(data || payload);
      fillFormFromProfile(data || payload);
      setEdit(false);
    } catch (error: any) {
      console.log("doctor update error:", error?.response?.data || error);

      if (error?.response?.status === 401) {
        errorNotification("Unauthorized - vui lòng đăng nhập lại");
      } else {
        errorNotification(
          error?.response?.data?.errorMessage || "Update failed",
        );
      }
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="p-10">
      <div className="flex justify-between items-start">
        <div className="flex gap-5 items-center">
          <div className="flex flex-col items-center gap-3">
            <Avatar
              variant="filled"
              src="/avatar.png"
              alt="it's me"
              size={150}
            />
            {editMode && (
              <Button size="sm" type="button" onClick={open} variant="filled">
                Upload
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-3xl font-medium text-neutral-900">
              {user?.name || "-"}
            </div>
            <div className="text-neutral-700 text-xl">{user?.email || "-"}</div>

            {editMode && (
              <div className="text-sm font-semibold text-teal-600">
                Editing mode
              </div>
            )}
          </div>
        </div>

        {!editMode ? (
          <Button
            size="lg"
            type="button"
            onClick={handleEdit}
            variant="filled"
            leftSection={<IconEdit />}>
            Edit
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button
              size="lg"
              type="button"
              variant="outline"
              onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button size="lg" type="submit" variant="filled">
              Submit
            </Button>
          </div>
        )}
      </div>

      <Divider my="xl" />

      <div key={editMode ? "edit-mode" : "view-mode"}>
        <div className="text-2xl font-medium mb-5 text-neutral-900">
          Personal Informations
        </div>

        {loading ? (
          <div className="text-lg text-neutral-600">Loading profile...</div>
        ) : (
          <Table
            striped
            stripedColor="primary.1"
            verticalSpacing="md"
            withRowBorders={false}>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td className="font-semibold text-xl">
                  Date of Birth
                </Table.Td>
                {editMode ? (
                  <Table.Td className="text-xl">
                    <DateInput
                      valueFormat="DD/MM/YYYY"
                      placeholder="Date of Birth"
                      {...form.getInputProps("dob")}
                    />
                  </Table.Td>
                ) : (
                  <Table.Td className="text-xl">
                    {profile?.dob ? formatDate(profile.dob) : "-"}
                  </Table.Td>
                )}
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="font-semibold text-xl">Phone</Table.Td>
                {editMode ? (
                  <Table.Td className="text-xl">
                    <NumberInput
                      {...form.getInputProps("phone")}
                      placeholder="Phone number"
                      hideControls
                      allowDecimal={false}
                      allowNegative={false}
                    />
                  </Table.Td>
                ) : (
                  <Table.Td className="text-xl">
                    {profile?.phone ?? "-"}
                  </Table.Td>
                )}
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="font-semibold text-xl">Address</Table.Td>
                {editMode ? (
                  <Table.Td className="text-xl">
                    <TextInput
                      {...form.getInputProps("address")}
                      placeholder="Address"
                    />
                  </Table.Td>
                ) : (
                  <Table.Td className="text-xl">
                    {profile?.address ?? "-"}
                  </Table.Td>
                )}
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="font-semibold text-xl">
                  License No
                </Table.Td>
                {editMode ? (
                  <Table.Td className="text-xl">
                    <TextInput
                      {...form.getInputProps("licenseNo")}
                      placeholder="License number"
                    />
                  </Table.Td>
                ) : (
                  <Table.Td className="text-xl">
                    {profile?.licenseNo ?? "-"}
                  </Table.Td>
                )}
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="font-semibold text-xl">
                  Specialization
                </Table.Td>
                {editMode ? (
                  <Table.Td className="text-xl">
                    <Select
                      {...form.getInputProps("specialization")}
                      placeholder="Specialization"
                      data={doctorSpecializations}
                    />
                  </Table.Td>
                ) : (
                  <Table.Td className="text-xl">
                    {profile?.specialization ?? "-"}
                  </Table.Td>
                )}
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="font-semibold text-xl">
                  Department
                </Table.Td>
                {editMode ? (
                  <Table.Td className="text-xl">
                    <Select
                      {...form.getInputProps("department")}
                      placeholder="Department"
                      data={doctorDepartments}
                    />
                  </Table.Td>
                ) : (
                  <Table.Td className="text-xl">
                    {profile?.department ?? "-"}
                  </Table.Td>
                )}
              </Table.Tr>

              <Table.Tr>
                <Table.Td className="font-semibold text-xl">
                  Total Experience
                </Table.Td>
                {editMode ? (
                  <Table.Td className="text-xl">
                    <NumberInput
                      {...form.getInputProps("totalExp")}
                      placeholder="Total Experience"
                      hideControls
                      allowDecimal={false}
                      allowNegative={false}
                      min={0}
                      max={60}
                    />
                  </Table.Td>
                ) : (
                  <Table.Td className="text-xl">
                    {profile?.totalExp !== undefined &&
                    profile?.totalExp !== null
                      ? `${profile.totalExp} years`
                      : "-"}
                  </Table.Td>
                )}
              </Table.Tr>
            </Table.Tbody>
          </Table>
        )}
      </div>

      <Modal
        centered
        opened={opened}
        onClose={close}
        title={
          <span className="text-xl font-medium">Upload Profile Picture</span>
        }>
        {/* Modal content */}
      </Modal>
    </form>
  );
};

export default Profile;

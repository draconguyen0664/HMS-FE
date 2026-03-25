import {
  Button,
  PasswordInput,
  SegmentedControl,
  TextInput,
} from "@mantine/core";
import { IconHeartbeat } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../Service/UserService";
import {
  errorNotification,
  successNotification,
} from "../Utility/NotificationUtil";
import { useState } from "react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      name: "",
      role: "PATIENT",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      name: (value) => (!value ? "Name is required" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        !value
          ? "Password is required"
          : !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(
                value,
              )
            ? "Password must be 8-15 characters long and include uppercase, lowercase, number, and special character"
            : null,
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords don't match",
    },
  });
  const handleSubmit = (values: typeof form.values) => {
    setLoading(true);
    registerUser(values)
      .then((_data) => {
        successNotification("Registered Successfully.");
        navigate("/login");
      })
      .catch((error) => {
        errorNotification(error.response.data.errorMessagge);
      })
      .finally(() => setLoading(false));
  };
  return (
    <div
      style={{ background: 'url("/bg.jpg")' }}
      className="h-screen w-screen !bg-cover !bg-center !bg-no-repeat flex flex-col items-center justify-center">
      <div className="py-3 text-pink-500 flex gap-1 items-center">
        <IconHeartbeat size={40} stroke={2.5} />
        <span className="font-semibold text-4xl">Pluse</span>
      </div>
      <div className="w-[450px] backdrop-blur-md py-8 p-10 rounded-lg">
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="flex flex-col gap-5 [&_input]:placeholder-neutral-100 [&_.mantine-Input-input]:!border-white focus-within:[&_.mantine-Input-input]:!border-pink-400 [&_.mantine-Input-input]:!border [&_input]:!pl-2 [&_svg]:text-white [&_input]:!text-white">
          <div className="self-center font-medium text-dark text-2xl">
            Register
          </div>
          <SegmentedControl
            {...form.getInputProps("role")}
            fullWidth
            size="md"
            radius="lg"
            color="pink"
            bg="none"
            className="[&_*]:text-white border border-white"
            data={[
              { label: "Patient", value: "PATIENT" },
              { label: "Doctor", value: "DOCTOR" },
              { label: "Admin", value: "ADMIN" },
            ]}
          />
          <TextInput
            className="transition duration-300"
            variant="unstyled"
            size="md"
            radius="md"
            placeholder="Name"
            {...form.getInputProps("name")}
          />
          <TextInput
            className="transition duration-300"
            variant="unstyled"
            size="md"
            radius="md"
            placeholder="Email"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            className="transition duration-300"
            variant="unstyled"
            size="md"
            radius="md"
            placeholder="Password"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            className="transition duration-300"
            variant="unstyled"
            size="md"
            radius="md"
            placeholder="Password"
            {...form.getInputProps("confirmPassword")}
          />
          <Button
            loading={loading}
            radius="md"
            size="md"
            type="submit"
            color="pink">
            Register
          </Button>
          <div className="text-dark text-sm self-center">
            Have an account?
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

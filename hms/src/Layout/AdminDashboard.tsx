import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="w-full flex flex-col">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};
export default AdminDashboard;

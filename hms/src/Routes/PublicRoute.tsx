import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const token = useSelector((state: any) => state.jwt);

  if (token) {
    const user: any = jwtDecode(token);
    return <Navigate to={`/${user?.role?.toLowerCase()}/dashboard`} />;
  }

  return <>{children}</>;
};

export default PublicRoute;

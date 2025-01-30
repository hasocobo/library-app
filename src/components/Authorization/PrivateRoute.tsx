import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../context/UserProvider";

const PrivateRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user } = useUser();
  
  if (!user) {
    return <Navigate to={"/login"} />
  }

  if (!user.roles.some((item) => allowedRoles.includes(item))) {
    return <Navigate to={"/unauthorized"} />
  }

  return <Outlet />
}

export default PrivateRoute;

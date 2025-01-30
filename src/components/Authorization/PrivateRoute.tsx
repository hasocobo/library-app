import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import Unauthorized from "../../pages/Unauthorized";

const PrivateRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user } = useUser();
  
  if (!user) {
    return <Navigate to={"/login"} />
  }

  if (!user.roles.some((item) => allowedRoles.includes(item))) {
    return <Unauthorized />
  }

  return <Outlet />
}

export default PrivateRoute;

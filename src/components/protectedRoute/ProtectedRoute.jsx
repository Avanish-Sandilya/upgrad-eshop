import useAuthentication from "../../hooks/useAuthentication";
import { useContext } from "react";
import Login from "../login/Login";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const { AuthCtx } = useAuthentication();
  const { loggedInUser, hasRole } = useContext(AuthCtx);

  if (!loggedInUser) {
    return <Login />;
  }

  if (!hasRole(role)) {
    return <Navigate to={"/home"} />;
  }

  return children;
};

export default ProtectedRoute;

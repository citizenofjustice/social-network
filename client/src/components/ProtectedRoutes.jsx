import { Navigate } from "react-router-dom";

/**
 * Component for restricting access based on authentication status
 */
const ProtectedRoutes = ({ allowed, children, path = "/login" }) => {
  if (!allowed) {
    return <Navigate to={path} replace />;
  } else return children;
};

export default ProtectedRoutes;

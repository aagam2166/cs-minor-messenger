import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Profile from "../pages/Profile";


function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(
    (state) => state.auth.status
  );

   console.log(
    "[ProtectedRoute] auth.status =",
    isAuthenticated,
    "for route",
    window.location.pathname
  );


  // if NOT logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // if logged in → allow access
  return children;
}

export default ProtectedRoute;

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../app/authSlice";
import { logoutRequest } from "../backend/auth";

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logoutRequest(); // backend logout
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      dispatch(logout());   // clear redux state
      navigate("/login");   // redirect
    }
  };

  return (
    <button
      onClick={logoutHandler}
      className="inline-block  px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
    >
      Logout
    </button>
  );
}

export default LogoutBtn;

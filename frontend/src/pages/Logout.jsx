import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { logout } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        if (logout) {
          await logout();
        }
      } catch (err) {
        console.error("Error while logging out:", err);
      } finally {
        navigate("/login");
      }
    };

    doLogout();
  }, [logout, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p className="text-gray-600 text-lg">Logout...</p>
    </div>
  );
};

export default Logout;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Account.css";

function Account() {
  const [member, setMember] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const res = await axios.get(
        "https://futurestorydbackend.onrender.com//api/users/me",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMember(res.data);
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.dispatchEvent(new Event("authChanged"));

    navigate("/");
  };

  if (!member) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 account-card">
        <h2 className="text-center mb-4">My Account</h2>

        <p><strong>Username:</strong> {member.username}</p>
        <p><strong>Email:</strong> {member.email}</p>
        <p><strong>Mobile:</strong> {member.mobile}</p>
        
        <button
          className="btn btn-outline-danger mt-3"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Account;

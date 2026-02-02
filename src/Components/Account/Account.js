import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Account.css";

function Account() {
  const [member, setMember] = useState(null);
  const [error, setError] = useState("");
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || !storedUser.id) {
      setIsLoggedOut(true);
      return;
    }

    axios
      .get(`http://localhost:4000/Account/${storedUser.id}`)
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
          setMember({ ...data, cart: data.cart || [] });
          setIsLoggedOut(false);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  const handleLogout = () => {
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("storage"));
  navigate("/");   // go home
};


  if (error) {
    return <p className="display-6 text-danger text-center">{error}</p>;
  }

  if (isLoggedOut) {
    return (
      <div className="container mt-5 text-center">
        <h3 className="text-danger">Please login into account</h3>
      </div>
    );
  }

  if (!member) {
    return <p className="text-center mt-5">Loading account...</p>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 account-card">
        <h2 className="text-center mb-4">My Account</h2>

        <div className="mb-3">
          <strong>Name:</strong> {member.name}
        </div>
        <div className="mb-3">
          <strong>Email:</strong> {member.email}
        </div>
        <div className="mb-3">
          <strong>Mobile:</strong> {member.mobile}
        </div>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            className="btn btn-primary px-4"
            onClick={() => navigate("/cart")}
          >
            My Cart ({member.cart?.length || 0})
          </button>

          <button
            className="btn btn-outline-danger px-4"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;

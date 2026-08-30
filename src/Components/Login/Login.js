import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../config/api";

function Login({ onClose, onLoginSuccess, onSwitchToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const loginRes = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          username: username.trim(),
          password: password.trim()
        }
      );


      const token = loginRes.data.token;

      localStorage.setItem("token", token);

      const userRes = await axios.get(
        `${API_URL}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      localStorage.setItem("user", JSON.stringify(userRes.data));

      window.dispatchEvent(new Event("authChanged"));

      onLoginSuccess();

    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div
      className="card shadow p-4 mx-auto"
      style={{
        width: "100%",
        maxWidth: "420px",
        borderRadius: "12px",
      }}
    >
      <button
        type="button"   
        onClick={onClose}
        style={{
          position: "absolute",
          top: "8px",
          right: "10px",
          border: "none",
          background: "none",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        ×
      </button>
      <h3 className="mb-4 fw-bold text-center">Log in</h3>

      <form onSubmit={handleLogin}>

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className="input-group-text"
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {error && (
          <p className="text-danger text-center fw-bold">{error}</p>
        )}

        <button
          type="submit"
          className="btn w-100 mt-3"
          style={{
            background: "linear-gradient(to right, #717273ff, #787a9cff)",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Login
        </button>
      </form>

      <p className="text-center mt-3" style={{ fontSize: "0.9rem" }}>
        Don’t have an account yet?{" "}
        <span
          className="text-primary"
          style={{ cursor: "pointer" }}
          onClick={onSwitchToRegister}
        >
          Register
        </span>
      </p>
    </div>
  );
}

export default Login;

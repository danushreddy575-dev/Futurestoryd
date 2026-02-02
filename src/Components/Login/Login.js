import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

function Login({ onClose, onLoginSuccess, onSwitchToRegister }){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.get("http://localhost:4000/Account");
      const accounts = res.data;

      const user = accounts.find(
        (acc) =>
          acc.name === username.trim() &&
          acc.password === password.trim()
      );

      if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          cart: user.cart || [],
        })
      );

      onLoginSuccess();   
    }
    else {
            setError("Invalid username or password");
          }
    } catch (err) {
      setError("Error connecting to server: " + err.message);
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
      {/* Username */}
      <div className="mb-3">
        <label className="form-label">Username</label>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          required
        />
      </div>

      {/* Password */}
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

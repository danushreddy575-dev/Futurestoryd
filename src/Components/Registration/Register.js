import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

function Register({ onClose, onSwitchToLogin }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({ mode: "onChange" });

  const password = watch("password");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    const { confirmPassword, ...userData } = data;

    try {
      const res = await axios.post(
        "https://futurestorydbackend.onrender.com/api/auth/register",
        userData
      );

      if (res.status === 201) onSwitchToLogin();
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="card shadow p-4 mx-auto position-relative"
      style={{ width: "100%", maxWidth: "420px", borderRadius: "12px" }}
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
          cursor: "pointer"
        }}
      >
        ×
      </button>

      <h3 className="fw-bold text-center mb-3">Create an Account</h3>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Username */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            {...register("username", {
              required: "Username is required"
            })}
          />
          {errors.username && (
            <small className="text-danger">
              {errors.username.message}
            </small>
          )}
        </div>

        {/* Email */}
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email"
              }
            })}
          />
          {errors.email && (
            <small className="text-danger">{errors.email.message}</small>
          )}
        </div>

        {/* Mobile */}
        <div className="mb-3">
          <input
            type="tel"
            className="form-control"
            placeholder="Mobile Number"
            {...register("mobile", {
              required: "Mobile number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter valid 10 digit mobile number"
              }
            })}
          />
          {errors.mobile && (
            <small className="text-danger">{errors.mobile.message}</small>
          )}
        </div>

        {/* Password */}
        <div className="mb-3 input-group">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Min 6 characters"
              }
            })}
          />
          <span
            className="input-group-text"
            style={{ cursor: "pointer" }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && (
          <small className="text-danger">{errors.password.message}</small>
        )}

        {/* Confirm Password */}
        <div className="mb-3 input-group">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="form-control"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value.trim() === password?.trim() ||
                "Passwords do not match"
            })}
          />
          <span
            className="input-group-text"
            style={{ cursor: "pointer" }}
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.confirmPassword && (
          <small className="text-danger">
            {errors.confirmPassword.message}
          </small>
        )}

        <button className="btn btn-dark w-100 mt-3">
          Register
        </button>
      </form>

      {message && (
        <p className="text-center mt-2 text-danger">{message}</p>
      )}
    </div>
  );
}

export default Register;

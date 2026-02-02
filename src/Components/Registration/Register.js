import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

function Register({ onClose, onSwitchToLogin }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  const password = watch("password");

  const onSubmit = (data) => {
    const { confirmPassword, ...userData } = data;

    axios
      .post("http://localhost:4000/Account", { ...userData, cart: [] })
      .then((response) => {
        if (response.status === 201) {
          onSwitchToLogin();
        }
      })
      .catch((err) => {
        setMessage(err.message);
      });
  };

  return (
    <div
      className="card shadow p-4 mx-auto position-relative"
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

      <h3 className="fw-bold text-center mb-2">Create an Account</h3>


      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label text-start w-100">Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your full name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <small className="text-danger">{errors.name.message}</small>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label text-start w-100">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="you@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            })}
          />
          {errors.email && (
            <small className="text-danger">{errors.email.message}</small>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label text-start w-100">Mobile No</label>
          <input
            type="tel"
            className="form-control"
            placeholder="Enter your mobile number"
            {...register("mobile", {
              required: "Mobile number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter valid 10 digit mobile number",
              },
            })}
          />
          {errors.mobile && (
            <small className="text-danger">{errors.mobile.message}</small>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label text-start w-100">Password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
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
        </div>

        <div className="mb-3">
          <label className="form-label text-start w-100">Confirm Password</label>
          <div className="input-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="form-control"
              placeholder="Re-enter password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
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
        </div>

        <button
          type="submit"
          className="btn w-100 mt-3"
          style={{
            background: "linear-gradient(to right, #717273ff, #787a9cff)",
            color: "white",
            fontWeight: "bold",
          }}
        >
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

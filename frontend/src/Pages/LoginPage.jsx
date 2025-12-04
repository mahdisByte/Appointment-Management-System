import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); // reset message on submit

    try {
      const res = await axios.post("http://localhost:8000/api/login", { email, password });

      // Check if token exists
      if (res.data.token) {
        // ✅ store JWT token
        localStorage.setItem("token", res.data.token);

        // Optional: store user info
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        setMessage("Login successful!");
        navigate("/homepage"); // redirect after login
      } else {
        setMessage(res.data.msg || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || "Error logging in");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {message && <p className="login-message">{message}</p>}
        <p style={{ marginTop: "20px", color: "#ccc" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#a7a7ff" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

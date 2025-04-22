import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../utils/supabase';
const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = isLogin
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      console.log("Auth response:", response);

      if (response.error) {
        setError(response.error.message);
      } else if (response.data) {
        console.log("Authentication successful:", response.data);
        navigate("/");
      } else {
        setError("Unexpected response format.");
      }
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : err}`);
      console.error(err);
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    fontFamily: "'Poppins', sans-serif",
    fontSize: "16px",
    color: "#333",
  };

  const authFormStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  };

  const headingStyle = {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: "700",
    color: "#2e7d32",
    fontSize: "2.2rem",
    textAlign: "center",
    marginBottom: "1.5rem",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  };

  const inputStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "1rem",
    padding: "10px",
    border: "1px solid #c8e6c9",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  };

  const buttonStyle = {
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "10px 20px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.3s ease",
  };

  const buttonHoverStyle = {
    backgroundColor: "#388e3c",
    transform: "scale(1.02)",
  };

  const errorStyle = {
    color: "#c62828",
    marginTop: "10px",
    textAlign: "center",
    fontSize: "0.9rem",
  };

  const switchButtonStyle = {
    backgroundColor: "transparent",
    border: "none",
    color: "#2196F3",
    cursor: "pointer",
    textDecoration: "underline",
    marginTop: "15px",
    fontSize: "0.95rem",
    fontFamily: "'Poppins', sans-serif",
  };

  const switchButtonHoverStyle = {
    color: "#1976D2",
  };

  return (
    <div style={containerStyle}>
      <div style={authFormStyle}>
        <h2 style={headingStyle}>{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleAuth} style={formStyle}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
            onMouseOut={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
          <p style={errorStyle}>{error}</p>
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={switchButtonStyle}
          onMouseOver={(e) => Object.assign(e.currentTarget.style, switchButtonHoverStyle)}
          onMouseOut={(e) => Object.assign(e.currentTarget.style, switchButtonStyle)}
        >
          {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
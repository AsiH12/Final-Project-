import React from 'react';
import { useRef } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "./LoginForm.css";
import { Box, TextField, Button } from '@mui/material';

interface LoginFormProps {
  setUserToken: (userId: string | null) => void;
}

export function LoginForm({ setUserToken }: LoginFormProps) {
  const navigate = useNavigate(); // Initialize useNavigate
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleLogin = async () => {
    try {
      const username = usernameRef.current?.value || "";
      const password = passwordRef.current?.value || "";

      const response = await fetch(`http://127.0.0.1:5000/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("username", username);

        setUserToken(data.access_token);
        navigate("/home"); // Navigate to '/home' after successful login
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      alert("Error logging in: " + error.message);
    }
  };

  return (
    <div className="container">
      <Box className="login-form">
        <h2 className="login-header" style={{ color: "white", fontSize: "4rem", marginTop: 0 }}>Login</h2>
        <Box>
          <TextField
            sx={{
              width: "400px",
              background: "white",
              borderRadius: "25px",
            }}
            id="username"
            label="Username"
            variant="outlined"
            inputRef={usernameRef}
            className="input-container"
            fullWidth
            margin="normal"
          />
        </Box>
        <Box>
          <TextField
           sx={{
            width: "400px",
            background: "white",
            borderRadius: "25px",
          }}
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            inputRef={passwordRef}
            className="input-container"
            fullWidth
            margin="normal"
          />
        </Box>
        <div className="button-container">
          <Button  sx={{
            height: "60px", borderRadius: "25px", fontSize : "1.5rem"
          }} variant="contained" color="primary" className='login-button' onClick={handleLogin}>
            Login
          </Button>
          <p className="signup-text">Don't have an account? <a href="/register">Sign up</a></p>
        </div>
      </Box>
    </div>
  );
}

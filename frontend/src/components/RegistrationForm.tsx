import React, { useRef } from "react";
import "./RegistrationForm.css";
import { Box, TextField, Button } from '@mui/material';

interface RegisterFormProps {
  setUserToken: (userId: string | null) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ setUserToken }) => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);

  const handleRegister = async () => {
    try {
      const username = usernameRef.current?.value || "";
      const email = emailRef.current?.value || "";
      const password = passwordRef.current?.value || "";
      const confirmPassword = confirmPasswordRef.current?.value || "";
      const role = roleRef.current?.value || "";
      const age = ageRef.current?.value || "";

      // Check if passwords match
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await fetch(`http://127.0.0.1:5000/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role, email, age }),
      });

      if (response.ok) {
        // Registration successful, you can handle further actions like redirecting
        alert("Registration successful");
        // Optionally, you can automatically login the user after registration
        // const loginResponse = await handleLogin(); // assuming handleLogin returns the access token
        // setUserToken(loginResponse.access_token);
      } else {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
      }
    } catch (error) {
      alert("Error registering: " + error.message);
    }
  };

  return (
    <div className="container">
      <Box className="register-form">
        <h2 className="registerHeader" style={{ color: "white", fontSize: "4rem", marginBottom: '10px' }}>Register</h2>
        <Box sx={{width: "80%"}}>
          <TextField
          sx={{
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
          <TextField
          sx={{
            background: "white",
            borderRadius: "25px",
          }}

            id="email"
            label="Email"
            type="email"
            variant="outlined"
            inputRef={emailRef}
            className="input-container"
            fullWidth
            margin="normal"
          />
          <TextField
          sx={{
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
          <TextField
          sx={{
            background: "white",
            borderRadius: "25px",
          }}
            id="confirm-password"
            label="Confirm Password"
            type="password"
            variant="outlined"
            inputRef={confirmPasswordRef}
            className="input-container"
            fullWidth
            margin="normal"
          />

          <TextField
          sx={{
            background: "white",
            borderRadius: "25px",
          }}

            id="role"
            label="Role"
            variant="outlined"
            inputRef={roleRef}
            className="input-container"
            fullWidth
            margin="normal"
          />

          <TextField
          sx={{
            background: "white",
            borderRadius: "25px",
          }}

            id="age"
            label="Age"
            variant="outlined"
            inputRef={ageRef}
            className="input-container"
            fullWidth
            margin="normal"
          />
        </Box>
        <div className="button-container">
          <Button sx={{
            height: "60px", borderRadius: "25px", fontSize : "1.5rem"
          }} variant="contained" color="primary" onClick={handleRegister}>
            SIGN UP
          </Button>
          <p className="signup-text">Already have an account? <a href="/login">Sign in</a></p>
        </div>
      </Box>
    </div>
  );
};

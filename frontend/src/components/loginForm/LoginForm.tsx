import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useForm } from "react-hook-form";
import { User } from "../../utils/types";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "./LoginForm.css";

interface LoginFormProps {
  setUserToken: (userId: string | null) => void;
}

export function LoginForm({ setUserToken }: LoginFormProps) {
  const navigate = useNavigate(); // Initialize useNavigate
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<User>();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (formData: User) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        console.log(formData.username);
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("username", formData.username);

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
        <h2
          className="login-header"
          style={{ color: "white", fontSize: "4rem", marginTop: 0 }}
        >
          Login
        </h2>
        <form onSubmit={handleSubmit(handleLogin)}>
          <Box>
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              className="input-container"
              fullWidth
              margin="normal"
              error={!!errors.username}
              helperText={errors.username ? errors.username.message : null}
              {...register("username", {
                required: "required",
              })}
              InputProps={{
                style: { backgroundColor: "white" },
              }}
            />
          </Box>
          <Box>
            <TextField
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              className="input-container"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : null}
              {...register("password", {
                required: "required",
                // pattern: {
                //   value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                //   message:
                //     "Your password must conatin 1 letter and 1 numerical number,and conatin 6 figures",
                // },
              })}
              InputProps={{
                style: { backgroundColor: "white" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <div className="button-container">
            <Button
              sx={{
                height: "60px",
                borderRadius: "25px",
                fontSize: "1.5rem",
              }}
              variant="contained"
              color="primary"
              className="login-button"
              type="submit"
            >
              Login
            </Button>
            <p className="signup-text" onClick={() => navigate("/register")}>
              Don't have an account? <a>Sign up</a>
            </p>
          </div>
        </form>
      </Box>
    </div>
  );
}

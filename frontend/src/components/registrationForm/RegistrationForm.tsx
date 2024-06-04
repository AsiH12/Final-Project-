import React, { useState } from "react";
import "./RegistrationForm.css";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { User } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface RegisterFormProps {
  setUserToken: (userId: string | null) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ setUserToken }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<User>();
  const password = watch("password");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleRegister = async (formData: User) => {
    try {
      // Create a copy of formData and remove confirmPassword
      const { confirmPassword, ...dataToSend } = formData;
      console.log(dataToSend);

      const response = await fetch(`http://localhost:5000/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        // Registration successful, you can handle further actions like redirecting
        alert("Registration successful");
        navigate("/login");
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
        <h2
          className="registerHeader"
          style={{ color: "white", fontSize: "4rem", marginBottom: "10px" }}
        >
          Register
        </h2>
        <form onSubmit={handleSubmit(handleRegister)}>
          <Box sx={{ width: "80%" }}>
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

            <TextField
              id="email"
              label="Email"
              type="email"
              variant="outlined"
              className="input-container"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : null}
              {...register("email", {
                required: "required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email address",
                },
              })}
              InputProps={{
                style: { backgroundColor: "white" },
              }}
            />
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
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                  message:
                    "Your password must conatin 1 letter and 1 numerical number,and conatin 6 figures",
                },
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
            <TextField
              id="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              className="input-container"
              fullWidth
              margin="normal"
              error={!!errors.confirmPassword}
              helperText={
                errors.confirmPassword ? errors.confirmPassword.message : null
              }
              {...register("confirmPassword", {
                required: "required",
                validate: (value) =>
                  value === password || "אימות הסיסמה אינו תואם את הסיסמה",
              })}
              InputProps={{
                style: { backgroundColor: "white" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleConfirmPasswordVisibility}>
                      {showConfirmPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              id="age"
              label="Age"
              variant="outlined"
              type="number"
              className="input-container"
              fullWidth
              margin="normal"
              error={!!errors.age}
              helperText={errors.age ? errors.age.message : null}
              {...register("age", {
                required: "required",
              })}
              InputProps={{
                style: { backgroundColor: "white" },
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
              type="submit"
            >
              SIGN UP
            </Button>
            <p className="signup-text" onClick={() => navigate("/login")}>
              Already have an account? <a>Sign in</a>
            </p>
          </div>
        </form>
      </Box>
    </div>
  );
};

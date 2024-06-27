import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Swal from "sweetalert2";
import "./ChangePasswordForm.css";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import apiURL from "../../constants/apiUrl";

interface PasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ChangePasswordForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PasswordFormData>();
  const [open, setOpen] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(Number(storedUserId));
    }
  }, []);

  const formValues = watch(); // Watch all form values

  const handlePasswordChange = async (formData: PasswordFormData) => {
    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "New password and confirmation do not match",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          container: "swal-dialog-custom",
        },
      });
      return;
    }

    try {
      const response = await fetch(
        `${apiURL}/users/reset-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            old_password: formData.oldPassword,
            new_password: formData.newPassword,
          }),
        }
      );

      if (response.ok) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Password changed successfully",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            container: "swal-dialog-custom",
          },
        });

        const handleLogout = () => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("username");
          localStorage.removeItem("user_id");
          navigate("/login");
        };

        setTimeout(() => {
          handleLogout();
        }, 3000);

        setOpen(false);
      } else {
        const errorData = await response.json();
        Swal.fire({
          position: "center",
          icon: "error",
          title: errorData.error,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            container: "swal-dialog-custom",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "An error occurred while changing the password",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    }
  };

  const isFormValid =
    formValues.oldPassword &&
    formValues.newPassword &&
    formValues.confirmPassword;

  return (
    <div className="container">
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        disabled={!userId}
      >
        Change Password
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <Divider />
        <DialogContent>
          <Box
            className="password-form"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Controller
              name="oldPassword"
              control={control}
              rules={{ required: "Old password is required" }}
              render={({ field }) => (
                <TextField
                  sx={{ width: "400px", background: "white" }}
                  id="oldPassword"
                  label="Old Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.oldPassword}
                  helperText={
                    errors.oldPassword ? errors.oldPassword.message : null
                  }
                  {...field}
                />
              )}
            />
            <Controller
              name="newPassword"
              control={control}
              rules={{ required: "New password is required" }}
              render={({ field }) => (
                <TextField
                  sx={{ width: "400px", background: "white" }}
                  id="newPassword"
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.newPassword}
                  helperText={
                    errors.newPassword ? errors.newPassword.message : null
                  }
                  {...field}
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              rules={{ required: "Confirm password is required" }}
              render={({ field }) => (
                <TextField
                  sx={{ width: "400px", background: "white" }}
                  id="confirmPassword"
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.confirmPassword}
                  helperText={
                    errors.confirmPassword
                      ? errors.confirmPassword.message
                      : null
                  }
                  {...field}
                />
              )}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
              }
              label="Show Password"
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(handlePasswordChange)}
            color="primary"
            disabled={!isFormValid}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

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
} from "@mui/material";
import Swal from "sweetalert2";
import "./ChangePasswordForm.css";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

interface ChangePasswordFormProps {
  onSubmit: (data: PasswordFormData) => void;
}

interface PasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ChangePasswordForm({ onSubmit }: ChangePasswordFormProps) {
  const { control, handleSubmit, formState: { errors }, watch } = useForm<PasswordFormData>();
  const [open, setOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(Number(storedUserId));
    }
  }, []);

  const handlePasswordChange = async (formData: PasswordFormData) => {
    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "New password and confirmation do not match",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/users/reset-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({ new_password: formData.newPassword }),
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
      });
    }
  };

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
              rules={{ required: "required" }}
              render={({ field }) => (
                <TextField
                  sx={{ width: "400px", background: "white" }}
                  id="oldPassword"
                  label="Old Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.oldPassword}
                  helperText={errors.oldPassword ? errors.oldPassword.message : null}
                  {...field}
                />
              )}
            />
            <Controller
              name="newPassword"
              control={control}
              rules={{ required: "required" }}
              render={({ field }) => (
                <TextField
                  sx={{ width: "400px", background: "white" }}
                  id="newPassword"
                  label="New Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.newPassword}
                  helperText={errors.newPassword ? errors.newPassword.message : null}
                  {...field}
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              rules={{ required: "required" }}
              render={({ field }) => (
                <TextField
                  sx={{ width: "400px", background: "white" }}
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword ? errors.confirmPassword.message : null}
                  {...field}
                />
              )}
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit(handlePasswordChange)} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

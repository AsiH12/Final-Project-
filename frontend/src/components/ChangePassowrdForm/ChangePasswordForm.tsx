import React, { useRef, useState, useEffect } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import Swal from 'sweetalert2';
import './ChangePasswordForm.css';

interface ChangePasswordFormProps {
  onSubmit: (data: PasswordFormData) => void;
}

interface PasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ChangePasswordForm({ onSubmit }: ChangePasswordFormProps) {
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(Number(storedUserId));
    }
  }, []);

  const handleSubmit = async () => {
    const oldPassword = oldPasswordRef.current?.value || '';
    const newPassword = newPasswordRef.current?.value || '';
    const confirmPassword = confirmPasswordRef.current?.value || '';

    if (newPassword !== confirmPassword) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'New password and confirmation do not match',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/reset-password/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_password: newPassword }),
      });

      if (response.ok) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Password changed successfully',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        setOpen(false); // Close the dialog after submitting
      } else {
        const errorData = await response.json();
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: errorData.error,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'An error occurred while changing the password',
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
        disabled={!userId} // Disable button if userId is not set
      >
        Change Password
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <Divider />
        <DialogContent>
          <Box className="password-form" sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <TextField
              sx={{ width: '400px', background: 'white' }}
              id="oldPassword"
              label="Old Password"
              type="password"
              variant="outlined"
              inputRef={oldPasswordRef}
              fullWidth
              margin="normal"
            />
            <TextField
              sx={{ width: '400px', background: 'white' }}
              id="newPassword"
              label="New Password"
              type="password"
              variant="outlined"
              inputRef={newPasswordRef}
              fullWidth
              margin="normal"
            />
            <TextField
              sx={{ width: '400px', background: 'white' }}
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              variant="outlined"
              inputRef={confirmPasswordRef}
              fullWidth
              margin="normal"
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

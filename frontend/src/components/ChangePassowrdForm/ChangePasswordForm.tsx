import React, { useRef, useState } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
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

  const handleSubmit = () => {
    const oldPassword = oldPasswordRef.current?.value || '';
    const newPassword = newPasswordRef.current?.value || '';
    const confirmPassword = confirmPasswordRef.current?.value || '';

    onSubmit({ oldPassword, newPassword, confirmPassword });
    setOpen(false); // Close the dialog after submitting
  };

  return (
    <div className="container">
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
      >
        Change Password
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <Divider />
        <DialogContent>
          <Box className="password-form"  sx={{
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

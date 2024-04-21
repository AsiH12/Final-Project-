import React, { useRef } from 'react';
import { Box, TextField, Button } from '@mui/material';
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

  const handleSubmit = () => {
    const oldPassword = oldPasswordRef.current?.value || '';
    const newPassword = newPasswordRef.current?.value || '';
    const confirmPassword = confirmPasswordRef.current?.value || '';

    onSubmit({ oldPassword, newPassword, confirmPassword });
  };

  return (
    <div className="container">
      <Box className="password-form">
        <h2 className="form-header">Change Password</h2>
        <Box>
          <TextField
            sx={{ width: '400px', background: 'white' }}
            id="oldPassword"
            label="Old Password"
            type="password"
            variant="outlined"
            inputRef={oldPasswordRef}
            className="input-container"
            fullWidth
            margin="normal"
          />
        </Box>
        <Box>
          <TextField
            sx={{ width: '400px', background: 'white' }}
            id="newPassword"
            label="New Password"
            type="password"
            variant="outlined"
            inputRef={newPasswordRef}
            className="input-container"
            fullWidth
            margin="normal"
          />
        </Box>
        <Box>
          <TextField
            sx={{ width: '400px', background: 'white' }}
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            variant="outlined"
            inputRef={confirmPasswordRef}
            className="input-container"
            fullWidth
            margin="normal"
          />
        </Box>
        <div className="button-container">
          <Button
            sx={{ height: '60px', borderRadius: '25px', fontSize: '1.5rem' }}
            variant="contained"
            color="primary"
            className="submit-button"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </Box>
    </div>
  );
}

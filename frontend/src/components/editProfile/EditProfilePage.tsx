import React from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link
import './EditProfilePage.css';

interface EditProfilePageProps {
  onChangePasswordClick: () => void;
  onAddRemoveAddressClick: () => void;
}

export function EditProfilePage({ onChangePasswordClick, onAddRemoveAddressClick }: EditProfilePageProps) {
  return (
    <div className="container">
      <h2 className="manage-account-header">Manage Account</h2>
      <Box
        className="edit-profile-options"
        sx={{
          backgroundColor: '#39cccc',
          borderRadius: '44px',
          boxShadow: '10px 8px 4px 0px #00000040',
          width: '600px',
          padding: '40px', // Increased padding
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2 className="edit-profile-header">Edit Profile</h2> {/* New headline */}
        <Link to="/changepassword" className="option"> {/* Link to Change Password */}
          <h3 className="option-text">Change Password</h3>
        </Link>
        <Link to="/changeaddress" className="option"> {/* Link to Add/Remove Address */}
          <h3 className="option-text">Add/Remove Address</h3>
        </Link>
      </Box>
    </div>
  );
}

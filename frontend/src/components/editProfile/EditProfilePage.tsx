import React from "react";
import { Box } from "@mui/material";
import { Link } from "react-router-dom"; // Import Link
import "./EditProfilePage.css";

export function EditProfilePage() {
  return (
    <Box>
      <h2 className="manage-account-header">Manage Account</h2>
      <Box className="edit-profile-options">
        <h2 className="edit-profile-header">Edit Profile</h2>
        <Link to="/changepassword" className="option">
          <h3 className="option-text">Change Password</h3>
        </Link>
        <Link to="/changeaddress" className="option">
          <h3 className="option-text">Add/Remove Address</h3>
        </Link>
      </Box>
    </Box>
  );
}

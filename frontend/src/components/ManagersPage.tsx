// ManagersPage.tsx
import React from 'react';
import { Box } from '@mui/material';
import './ManagersPage.css';

export function ManagersPage() {
  return (
    <div className="container">
      <h2 className="manage-store-header">Managers</h2>
      <Box
        className="managers-table"
        sx={{
          backgroundColor: '#39cccc',
          borderRadius: '44px',
          boxShadow: '10px 8px 4px 0px #00000040',
          width: '800px',
          height: '600px',
          padding: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* This is where the table will be fetched later */}
      </Box>
    </div>
  );
}

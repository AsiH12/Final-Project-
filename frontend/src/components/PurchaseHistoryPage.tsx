import React from 'react';
import { Box } from '@mui/material';
import './PurchaseHistoryPage.css';

export function PurchaseHistoryPage() {
  return (
    <div className="container">
      <h2 className="purchase-history-header" style={{ color: '#39cccc', boxShadow: 'white' }}>
        Purchase History
      </h2>
      <Box
        className="purchase-history-table"
        sx={{
          backgroundColor: '#39cccc',
          borderRadius: '44px',
          boxShadow: '10px 8px 4px 0px #00000040',
          width: '800px',
          height: '600px', // Adjusted height
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
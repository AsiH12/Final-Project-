import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import './PurchaseHistoryPage.css';

export function PurchaseHistoryPage() {
  return (
    <div className="container">
      <h2 className="purchase-history-header" style={{ color: '#39cccc' }}>
        Purchase History
      </h2>
      <Box
        className="purchase-history-card"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card
          sx={{
            backgroundColor: '#39cccc',
            borderRadius: '44px',
            boxShadow: '10px 8px 4px 0px #00000040',
            width: 800,
            height: 600, // Adjusted height
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CardContent>
            <Typography variant="h5" component="div" style={{ color: 'white' }}>
              Purchase History
            </Typography>
            <Box sx={{ mt: 3 }}>
              {/* Here you can add the content of your purchase history table */}
              {/* For example: */}
              <Typography variant="body1" style={{ color: 'white' }}>
                Purchase 1
              </Typography>
              <Typography variant="body1" style={{ color: 'white' }}>
                Purchase 2
              </Typography>
              <Typography variant="body1" style={{ color: 'white' }}>
                Purchase 3
              </Typography>
              {/* Add more purchase history items as needed */}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

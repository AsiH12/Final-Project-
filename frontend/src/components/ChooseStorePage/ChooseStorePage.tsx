import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import './ChooseStorePage.css';

interface ChooseStorePageProps {
  onStoreSelect: (storeName: string) => void;
}

export function ChooseStorePage({ onStoreSelect }: ChooseStorePageProps) {
  // Sample store data, you can replace this with your actual data
  const stores = [
    { name: 'Store 1', ownedBy: 'John Doe', managedBy: 'Jane Smith' },
    { name: 'Store 2', ownedBy: 'Alice Johnson', managedBy: 'Bob Brown' },
    { name: 'Store 3', ownedBy: 'Charlie Davis', managedBy: 'David Wilson' },
    { name: 'Store 4', ownedBy: 'Eve Taylor', managedBy: 'Frank Miller' },
  ];

  const handleStoreSelect = (storeName: string) => {
    onStoreSelect(storeName);
  };

  return (
    <div className="container">
      <h2 className="manage-store-header" style={{ color: '#39cccc' }}>
        Manage Store
      </h2>
      <h2 className="choose-store-header" style={{ color: '#39cccc' }}>
        Choose Store:
      </h2>
      <Box
        className="store-list"
        sx={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
        }}
      >
        {stores.map((store, index) => (
          <Card
            key={`store-${index}`}
            className="store-card"
            onClick={() => handleStoreSelect(store.name)}
            sx={{
              minWidth: 1800,
              height: 200,
              display: 'flex',
              borderRadius: '10px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" component="div">
                {store.name}
              </Typography>
              <Box>
                <Typography variant="body2" component="p">
                  <strong>Owned by:</strong> {store.ownedBy}
                </Typography>
                <Typography variant="body2" component="p">
                  <strong>Managed by:</strong> {store.managedBy}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
}

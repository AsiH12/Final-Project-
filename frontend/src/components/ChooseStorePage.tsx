import React from 'react';
import { Box } from '@mui/material';
import './ChooseStorePage.css';

interface ChooseStorePageProps {
  onStoreSelect: (storeName: string) => void;
}

export function ChooseStorePage({ onStoreSelect }: ChooseStorePageProps) {
  // Sample store names, you can replace these with your actual data
  const stores = ['Store 1', 'Store 2', 'Store 3', 'Store 4', 'Store 5'];

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
      {/* Added headline */}
      <Box
        className="store-list"
        sx={{
          backgroundColor: '#39cccc',
          borderRadius: '44px',
          boxShadow: '10px 8px 4px 0px #00000040',
          width: '600px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: 'white', // Set text color to white
        }}
      >
        {stores.map((store, index) => (
          <div
            key={index}
            className="store-item"
            onClick={() => handleStoreSelect(store)}
            style={{ color: 'white', cursor: 'pointer' }} // Set text color to white and cursor to pointer
          >
            {store}
          </div>
        ))}
      </Box>
    </div>
  );
}

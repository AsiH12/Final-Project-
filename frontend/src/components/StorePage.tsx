import React from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import './StorePage.css';

interface StorePageProps {
  storeName: string;
}

export function StorePage({ storeName }: StorePageProps) {
  return (
    <div className="container">
      <h2 className="manage-store-header">{storeName}</h2>
      <Box
        className="store-options"
        sx={{
          backgroundColor: '#39cccc',
          borderRadius: '44px',
          boxShadow: '10px 8px 4px 0px #00000040',
          width: '600px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Link to="/items" className="option">
          <h3 className="option-text">Items</h3>
        </Link>
        <Link to="/createitem" className="option">
          <h3 className="option-text">Create new item</h3>
        </Link>
        <Link to="/edititem" className="option">
          <h3 className="option-text">Edit Item</h3>
        </Link>
        <Link to="/orders" className="option">
          <h3 className="option-text">Orders</h3>
        </Link>
        <Link to="/revenues" className="option"> {/* Updated link */}
          <h3 className="option-text">Revenues</h3>
        </Link>
      </Box>
    </div>
  );
}

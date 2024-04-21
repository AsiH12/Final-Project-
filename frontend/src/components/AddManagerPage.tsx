import React from 'react';
import { Box, TextField, Button } from '@mui/material';
import './AddManagerPage.css';

interface AddManagerPageProps {
  storeName: string;
}

export function AddManagerPage({ storeName }: AddManagerPageProps) {
  const handleAddManager = () => {
    // Add manager logic
    console.log('Add Manager clicked');
  };

  return (
    <div className="container">
      <h2 className="manage-store-header">Manage Store - {storeName}</h2>
      <h2 className="add-manager-header">Add Manager</h2>
      <Box
        className="add-manager-form"
        sx={{
          backgroundColor: '#39cccc',
          borderRadius: '44px',
          boxShadow: '10px 8px 4px 0px #00000040',
          width: '600px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <TextField
          sx={{ width: '400px', marginBottom: '20px', '& input': { backgroundColor: 'white' } }} // Set input box background color to white
          id="id"
          label="ID"
          variant="outlined"
          margin="normal"
        />
        <TextField
          sx={{ width: '400px', marginBottom: '20px', '& input': { backgroundColor: 'white' } }} // Set input box background color to white
          id="username"
          label="Username"
          variant="outlined"
          margin="normal"
        />
        <TextField
          sx={{ width: '400px', marginBottom: '20px', '& input': { backgroundColor: 'white' } }} // Set input box background color to white
          id="role"
          label="Role"
          variant="outlined"
          margin="normal"
        />
        <Button
          sx={{ width: '200px', height: '50px', borderRadius: '25px', fontSize: '1.2rem' }}
          variant="contained"
          color="primary"
          onClick={handleAddManager}
        >
          Add Manager
        </Button>
      </Box>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import './UsersPage.css';

interface User {
  id: number;
  // Add other user properties as needed
}

export function UsersPage({ storeName }: { storeName: string }) {
  const [users, setUsers] = useState<User[]>([]); // State to store users

  useEffect(() => {
    // Fetch users when component mounts
    fetchUsers()
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  // Mock function for fetching users (Replace with actual fetch logic)
  const fetchUsers = async () => {
    // Mock implementation
    return [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ];
  };

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    // Add other columns as needed
  ];

  return (
    <div className="container">
      <h2 className="manage-store-header">Manage Store</h2>
      <h3 className="store-name">{storeName}</h3>
      <h2 className="users-header">USERS</h2>
      <Box
        className="users-table"
        sx={{
          backgroundColor: 'white',
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
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import './ManagersPage.css';

interface Manager {
  id: number;
  // Add other manager properties as needed
}

export function ManagersPage() {
  const [managers, setManagers] = useState<Manager[]>([]); // State to store managers

  useEffect(() => {
    // Fetch managers when component mounts
    fetchManagers()
      .then((data) => setManagers(data))
      .catch((error) => console.error('Error fetching managers:', error));
  }, []);

  // Mock function for fetching managers (Replace with actual fetch logic)
  const fetchManagers = async () => {
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
      <h2 className="manage-store-header">Managers</h2>
      <Box
        className="managers-table"
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
          rows={managers}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>
    </div>
  );
}

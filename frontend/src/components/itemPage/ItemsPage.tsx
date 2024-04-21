import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';
import './ItemsPage.css';

interface Item {
  id: number;
  name: string;
  // Add other item properties as needed
}

export function ItemsPage() {
  const [storeName, setStoreName] = useState<string>(''); // State to store the store name
  const [items, setItems] = useState<Item[]>([]); // State to store items
  const { storeId } = useParams<{ storeId: string }>(); // Get storeId from URL params

  useEffect(() => {
    // Fetch store name and items when storeId changes
    fetchStoreData(storeId)
      .then((data) => {
        setStoreName(data.storeName);
        setItems(data.items);
      })
      .catch((error) => console.error('Error fetching store data:', error));
  }, [storeId]);

  // Function to fetch store name and items (Replace with actual fetch logic)
  const fetchStoreData = async (storeId: string) => {
    // Mock implementation
    const storeNameResponse = await fetchStoreName(storeId);
    const itemsResponse = await fetchItems(storeId);
    return { storeName: storeNameResponse.name, items: itemsResponse };
  };

  // Mock function for fetching store name (Replace with actual fetch logic)
  const fetchStoreName = async (storeId: string) => {
    // Mock implementation
    return { name: "Store Name" };
  };

  // Mock function for fetching items (Replace with actual fetch logic)
  const fetchItems = async (storeId: string) => {
    // Mock implementation
    return [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
      { id: 3, name: "Item 3" },
    ];
  };

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 200 },
    // Add other columns as needed
  ];

  return (
    <div className="container">
      <h2 className="items-header">
        <span style={{ color: '#39cccc' }}>Items - {storeName}</span>
      </h2>
      <Box
        className="items-table"
        sx={{
          backgroundColor: 'white',
          boxShadow: "10px 8px 4px 0px #00000040",
          borderRadius: '44px',
          width: '800px',
          height: '600px',
          padding: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <DataGrid
          rows={items}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
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
    // Fetch store name from the database based on storeId
    // Replace this with your actual fetch logic
    fetchStoreName(storeId)
      .then((data) => setStoreName(data.name))
      .catch((error) => console.error('Error fetching store name:', error));

    // Fetch items from the database based on storeId
    // Replace this with your actual fetch logic
    fetchItems(storeId)
      .then((data) => setItems(data))
      .catch((error) => console.error('Error fetching items:', error));
  }, [storeId]);

  // Mock functions for fetching data (Replace with actual fetch logic)
  const fetchStoreName = async (storeId: string) => {
    // Mock implementation
    return { name: "Store Name" };
  };

  const fetchItems = async (storeId: string) => {
    // Mock implementation
    return [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
      { id: 3, name: "Item 3" },
    ];
  };

  return (
    <div className="container">
      <h2 className="items-header">
        <span style={{ color: '#39cccc' }}>Items - {storeName}</span>
      </h2> {/* Display store name */}
      <Box
        className="items-table"
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
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              {/* Add other table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                {/* Add other table cells as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </div>
  );
}

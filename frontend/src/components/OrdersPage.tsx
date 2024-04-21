import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import './OrdersPage.css';

interface Order {
  id: number;
  // Add other order properties as needed
}

export function OrdersPage() {
  const [storeName, setStoreName] = useState<string>(''); // State to store the store name
  const [orders, setOrders] = useState<Order[]>([]); // State to store orders
  const { storeId } = useParams<{ storeId: string }>(); // Get storeId from URL params

  useEffect(() => {
    // Fetch store name from the database based on storeId
    // Replace this with your actual fetch logic
    fetchStoreName(storeId)
      .then((data) => setStoreName(data.name))
      .catch((error) => console.error('Error fetching store name:', error));

    // Fetch orders from the database based on storeId
    // Replace this with your actual fetch logic
    fetchOrders(storeId)
      .then((data) => setOrders(data))
      .catch((error) => console.error('Error fetching orders:', error));
  }, [storeId]);

  // Mock function for fetching store name (Replace with actual fetch logic)
  const fetchStoreName = async (storeId: string) => {
    // Mock implementation
    return { name: "Store Name" };
  };

  // Mock function for fetching orders (Replace with actual fetch logic)
  const fetchOrders = async (storeId: string) => {
    // Mock implementation
    return [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ];
  };

  return (
    <div className="container">
      <h2 className="orders-header">
        <span style={{ color: '#39cccc' }}>Orders - {storeName}</span>
      </h2> {/* Display store name */}
      <Box
        className="orders-table"
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
              {/* Add other table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                {/* Add other table cells as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </div>
  );
}

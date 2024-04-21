import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import "./OrdersPage.css";

interface Order {
  id: number;
  // Add other order properties as needed
}

export function OrdersPage() {
  const [storeName, setStoreName] = useState<string>(""); // State to store the store name
  const [orders, setOrders] = useState<Order[]>([]); // State to store orders
  const { storeId } = useParams<{ storeId: string }>(); // Get storeId from URL params

  useEffect(() => {
    // Fetch store name and orders when storeId changes
    fetchStoreData(storeId)
      .then((data) => {
        setStoreName(data.storeName);
        setOrders(data.orders);
      })
      .catch((error) => console.error("Error fetching store data:", error));
  }, [storeId]);

  // Function to fetch store name and orders (Replace with actual fetch logic)
  const fetchStoreData = async (storeId: string) => {
    // Mock implementation
    const storeNameResponse = await fetchStoreName(storeId);
    const ordersResponse = await fetchOrders(storeId);
    return { storeName: storeNameResponse.name, orders: ordersResponse };
  };

  // Mock function for fetching store name (Replace with actual fetch logic)
  const fetchStoreName = async (storeId: string) => {
    // Mock implementation
    return { name: "Store Name" };
  };

  // Mock function for fetching orders (Replace with actual fetch logic)
  const fetchOrders = async (storeId: string) => {
    // Mock implementation
    return [{ id: 1 }, { id: 2 }, { id: 3 }];
  };

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    // Add other columns as needed
  ];

  return (
    <div className="container">
      <h2 className="orders-header">
        <span style={{ color: "#39cccc" }}>Orders - {storeName}</span>
      </h2>
      <Box
        className="orders-table"
        sx={{
          backgroundColor: "white",
          borderRadius: "44px",
          boxShadow: "10px 8px 4px 0px #00000040",
          width: "800px",
          height: "600px",
          padding: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <DataGrid
          rows={orders}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>
    </div>
  );
}

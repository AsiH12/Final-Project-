import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import "./RevenuesPage.css";

interface Revenue {
  id: number;
  // Add other revenue properties as needed
}

export function RevenuesPage() {
  const [storeName, setStoreName] = useState<string>(""); // State to store the store name
  const [revenues, setRevenues] = useState<Revenue[]>([]); // State to store revenues
  const { storeId } = useParams<{ storeId: string }>(); // Get storeId from URL params

  useEffect(() => {
    // Fetch store name and revenues when storeId changes
    fetchStoreData(storeId)
      .then((data) => {
        setStoreName(data.storeName);
        setRevenues(data.revenues);
      })
      .catch((error) => console.error("Error fetching store data:", error));
  }, [storeId]);

  // Function to fetch store name and revenues (Replace with actual fetch logic)
  const fetchStoreData = async (storeId: string) => {
    // Mock implementation
    const storeNameResponse = await fetchStoreName(storeId);
    const revenuesResponse = await fetchRevenues(storeId);
    return { storeName: storeNameResponse.name, revenues: revenuesResponse };
  };

  // Mock function for fetching store name (Replace with actual fetch logic)
  const fetchStoreName = async (storeId: string) => {
    // Mock implementation
    return { name: "Store Name" };
  };

  // Mock function for fetching revenues (Replace with actual fetch logic)
  const fetchRevenues = async (storeId: string) => {
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
      <h2 className="revenues-header">
        <span style={{ color: "#39cccc" }}>Revenues - {storeName}</span>
      </h2>
      <Box
        className="revenues-table"
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
          rows={revenues}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>
    </div>
  );
}

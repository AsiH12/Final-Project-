import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useLocation, useParams } from "react-router-dom";
import "./OrdersPage.css";

interface Order {
  id: number;
  product_name: string;
  shop_name: string;
  user_name: string;
  quantity: number;
  product_price: number;
  purchase_date: string;
  city: string;
  country: string;
  shipping_address: string;
  shipping_completed: boolean;
  total_price: number;
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]); // State to store orders

  const location = useLocation();

  const { shop_name } = useParams();
  const { storeId, role, owner } = location.state || {
    storeId: null,
    role: null,
    owner: null,
  };

  useEffect(() => {
    if (storeId) {
      fetchOrders()
        .then((data) => {
          setOrders(data);
        })
        .catch((error) => console.error("Error fetching store data:", error));
    }
  }, [storeId]);

  // Function to fetch store name and orders
  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/purchase-history/shop_name/${shop_name}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (!data.error) return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "product_name", headerName: "Product Name", width: 150 },
    { field: "shop_name", headerName: "Shop Name", width: 150 },
    { field: "user_name", headerName: "User Name", width: 150 },
    { field: "quantity", headerName: "Quantity", width: 120 },
    { field: "product_price", headerName: "Product Price", width: 150 },
    { field: "purchase_date", headerName: "Purchase Date", width: 150 },
    { field: "city", headerName: "City", width: 150 },
    { field: "country", headerName: "Country", width: 150 },
    { field: "shipping_address", headerName: "Shipping Address", width: 200 },
    {
      field: "shipping_completed",
      headerName: "Shipping Completed",
      width: 150,
    },
    { field: "total_price", headerName: "Total Price", width: 150 },
  ];

  return (
    <div className="container">
      <h2 className="orders-header">
        <span style={{ color: "#39cccc" }}>Orders - {shop_name}</span>
      </h2>
      <Box
        className="orders-table"
        sx={{
          backgroundColor: "white",
          borderRadius: "44px",
          boxShadow: "10px 8px 4px 0px #00000040",
          width: "1000px",
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
          rowsPerPageOptions={[5, 10, 15]}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>
    </div>
  );
}

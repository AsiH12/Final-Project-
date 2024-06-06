import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { useParams, useLocation } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
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

interface Shop {
  id: number;
  name: string;
  description: string;
  owner_id: number;
  role: string;
}

export function OrdersPage({ ownerView }) {
  const [orders, setOrders] = useState<Order[]>([]); // State to store orders
  const { shop_name } = useParams();
  const location = useLocation();
  const logged_user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchOrders = async () => {
      const url = ownerView
        ? `http://localhost:5000/purchase-history/manager_owner`
        : `http://localhost:5000/purchase-history/shop_name/${shop_name}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token
        },
      });
      const data = await response.json();
      if (!data.error) setOrders(data.purchases || []);
    };

    fetchOrders().catch((error) =>
      console.error("Error fetching orders:", error)
    );
  }, [shop_name, ownerView]);

  const handleDeleteClick = async (id: number) => {
    const response = await fetch(
      `http://localhost:5000/purchase-history/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token
        },
      }
    );
    if (response.ok) {
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Order has been deleted successfully.",
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    } else {
      console.error("Error deleting order");
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Error deleting order.",
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    }
  };

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
    // {
    //   field: "shipping_completed",
    //   headerName: "Shipping Completed",
    //   width: 150,
    // },
    { field: "total_price", headerName: "Total Price", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(params.id as number)}
        />,
      ],
    },
  ];

  return (
    <div className="container">
      <h2 className="orders-header">
        <span style={{ color: "#39cccc" }}>
          {ownerView ? "Orders" : `Orders - ${shop_name}`}
        </span>
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
          disableSelectionOnClick
        />
      </Box>
    </div>
  );
}

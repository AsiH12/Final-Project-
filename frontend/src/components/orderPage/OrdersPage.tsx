import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import "./OrdersPage.css";
import noimage from "../../images/noimage.jpeg"; // Ensure this path is correct
import apiURL from "../../constants/apiUrl";

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
  product_image: string | null; // Ensure this field is included
}

interface OrdersPageProps {
  ownerView: boolean;
}

export function OrdersPage({ ownerView }: OrdersPageProps) {
  const [orders, setOrders] = useState<Order[]>([]); // State to store orders
  const { shop_name } = useParams<{ shop_name: string }>();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchOrders = async () => {
      const url = ownerView
        ? `${apiURL}/purchase-history/manager_owner`
        : `${apiURL}/purchase-history/shop_name/${shop_name}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token
        },
      });
      const data = await response.json();
      console.log("Orders data: ", data); // Log the received data to verify image data
      if (!data.error) setOrders(data.purchases || []);
    };

    fetchOrders().catch((error) =>
      console.error("Error fetching orders:", error)
    );
  }, [shop_name, ownerView]);

  const handleDeleteClick = async (id: number) => {
    const response = await fetch(
      `${apiURL}/purchase-history/${id}`,
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
    { field: "product_name", headerName: "Product Name", flex: 1 },
    { field: "shop_name", headerName: "Shop Name", flex: 1 },
    { field: "user_name", headerName: "User Name", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    { field: "product_price", headerName: "Product Price", flex: 1 },
    { field: "purchase_date", headerName: "Purchase Date", flex: 1 },
    { field: "city", headerName: "City", flex: 1 },
    { field: "country", headerName: "Country", flex: 1 },
    { field: "shipping_address", headerName: "Shipping Address", flex: 1 },
    { field: "total_price", headerName: "Total Price", flex: 1 },
    {
      field: "product_image",
      headerName: "Image",
      width: 150,
      renderCell: (params) =>
        params.value ? (
          <img
            src={`data:image/jpeg;base64,${params.value}`}
            alt="Product"
            style={{ width: "auto", height: "100%" }}
          />
        ) : (
          <img
            src={noimage}
            alt="No Image"
            style={{ width: "auto", height: "100%" }}
          />
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 1,
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
        sx={{
          display: "flex",
          height: "80%",
          width: "100%",
        }}
      >
        <DataGrid
          rows={orders}
          columns={columns}
          rowHeight={100}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 15]}
          disableSelectionOnClick
        />
      </Box>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
  GridFilterModel,
} from "@mui/x-data-grid";
import "./PurchaseHistoryPage.css";
import noimage from "../../images/noimage.jpeg"; // Ensure this path is correct
import apiURL from "../../constants/apiUrl";

interface Purchase {
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
  product_image: string | null; // Add this line
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Box>
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
        </Box>
        <GridToolbarQuickFilter />
      </Box>
    </GridToolbarContainer>
  );
}

export function PurchaseHistoryPage() {
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const response = await fetch(`${apiURL}/purchase-history/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send JWT token
          },
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setPurchaseHistory(data);
      } catch (error) {
        console.error("Failed to fetch purchase history", error);
      }
      setLoading(false);
    };

    fetchPurchaseHistory();
  }, [token]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90, editable: false },
    {
      field: "product_name",
      headerName: "Product",
      width: 150,
      editable: false,
    },
    { field: "shop_name", headerName: "Shop", width: 150, editable: false },
    { field: "user_name", headerName: "User", width: 120, editable: false },
    { field: "quantity", headerName: "Quantity", width: 130, editable: false },
    {
      field: "product_price",
      headerName: "Product Price",
      type: "number",
      width: 130,
      editable: false,
    },
    {
      field: "purchase_date",
      headerName: "Purchase Date",
      width: 150,
      editable: false,
    },
    { field: "city", headerName: "City", width: 120, editable: false },
    { field: "country", headerName: "Country", width: 120, editable: false },
    {
      field: "shipping_address",
      headerName: "Shipping Address",
      width: 200,
      editable: false,
    },
    {
      field: "total_price",
      headerName: "Total Price",
      type: "number",
      width: 130,
      editable: false,
    },
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
  ];

  return (
    <Box
      sx={{
        display: "flex",
        height: "80%",
        width: "100%",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={purchaseHistory}
          columns={columns}
          rowHeight={100}
          columnVisibilityModel={{
            total_price: false,
          }}
          slots={{
            toolbar: CustomToolbar,
          }}
          filterModel={filterModel}
          onFilterModelChange={(model) => setFilterModel(model)}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25]}
          disableColumnMenu
        />
      )}
    </Box>
  );
}

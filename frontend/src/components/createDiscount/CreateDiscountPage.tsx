import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useLocation, useParams } from "react-router-dom";
import "./CreateDiscountPage.css";

export function CreateDiscountPage() {
  const location = useLocation();
  const { shop_name } = useParams();
  const { storeId, } = location.state;
  const [allowOthers, setAllowOthers] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [shopDiscounts, setShopDiscounts] = useState<any[]>([]);
  const [productDiscounts, setProductDiscounts] = useState<any[]>([]);

  const discountNameRef = useRef<HTMLInputElement>(null);
  const productIdRef = useRef<HTMLInputElement>(null);
  const storeIdRef = useRef<HTMLInputElement>(null);
  const discountCodeRef = useRef<HTMLInputElement>(null);
  const expirationDateRef = useRef<HTMLInputElement>(null);
  const minimumAmountRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    fetchShopDiscounts();
    fetchProductDiscounts();
  }, []);

  const fetchShopDiscounts = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/discounts/shops/by_shop_name/${shop_name}`
      );
      const data = await response.json();
      if (!data.error) setShopDiscounts(data.discounts);
    } catch (error) {
      console.error("Error fetching shop discounts:", error);
    }
  };

  const fetchProductDiscounts = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/discounts/products/by_shop_name/${shop_name}`
      );
      const data = await response.json();
      if (!data.error) setProductDiscounts(data.discounts);
    } catch (error) {
      console.error("Error fetching product discounts:", error);
    }
  };

  const handleCreateDiscount = () => {
    const discountName = discountNameRef.current?.value || "";
    const productId = productIdRef.current?.value || "";
    const storeId = storeIdRef.current?.value || "";
    const discountCode = discountCodeRef.current?.value || "";
    const expirationDate = expirationDateRef.current?.value || "";
    const minimumAmount = minimumAmountRef.current?.value || "";

    // Send the data to the server or handle as needed
    console.log("Discount Name:", discountName);
    console.log("Product ID:", productId);
    console.log("Store ID:", storeId);
    console.log("Discount Code:", discountCode);
    console.log("Expiration Date:", expirationDate);
    console.log("Minimum Amount:", minimumAmount);
    console.log("Allow Others:", allowOthers);

    // Close the dialog
    setOpen(false);
  };

  const handleEdit = async (id: number, isProductDiscount: boolean) => {
    const discountType = isProductDiscount ? "products" : "shops";
    try {
      // Implement edit functionality
      console.log(`Edit discount with id: ${id}`);
      // Example edit implementation (you need to adjust it to your needs)
      const response = await fetch(
        `http://localhost:5000/discounts/${discountType}/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Add fields to update here
            discount_code: "NEW_CODE",
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        Swal.fire("Success", "Discount updated successfully", "success");
        fetchShopDiscounts();
        fetchProductDiscounts();
      } else {
        Swal.fire("Error", data.error || "Failed to update discount", "error");
      }
    } catch (error) {
      console.error(`Error editing ${discountType} discount:`, error);
      Swal.fire(
        "Error",
        "An error occurred while updating the discount",
        "error"
      );
    }
  };

  const handleDelete = async (id: number, isProductDiscount: boolean) => {
    const discountType = isProductDiscount ? "products" : "shops";
    try {
      // Implement delete functionality
      console.log(`Delete discount with id: ${id}`);
      const response = await fetch(
        `http://localhost:5000/discounts/${discountType}/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (response.ok) {
        Swal.fire("Success", "Discount deleted successfully", "success");
        fetchShopDiscounts();
        fetchProductDiscounts();
      } else {
        Swal.fire("Error", data.error || "Failed to delete discount", "error");
      }
    } catch (error) {
      console.error(`Error deleting ${discountType} discount:`, error);
      Swal.fire(
        "Error",
        "An error occurred while deleting the discount",
        "error"
      );
    }
  };

  const productDiscountColumns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "product_id", headerName: "Product ID", width: 150 },
    { field: "discount_code", headerName: "Discount Code", width: 150 },
    { field: "discount", headerName: "Discount", width: 150 },
    { field: "expiration_date", headerName: "Expiration Date", width: 150 },
    { field: "minimum_amount", headerName: "Minimum Amount", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row.id, true)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id, true)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const shopDiscountColumns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "shop_id", headerName: "Shop ID", width: 150 },
    { field: "discount_code", headerName: "Discount Code", width: 150 },
    { field: "discount", headerName: "Discount", width: 150 },
    { field: "expiration_date", headerName: "Expiration Date", width: 150 },
    { field: "minimum_amount", headerName: "Minimum Amount", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row.id, false)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id, false)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div className="container">
      <h2 className="manage-store-header">Manage Store</h2>
      <h3 className="store-name">{shop_name}</h3>
      <h2 className="create-discount-header">Create New Discount</h2>
      <div className="button-container">
        <Button
          sx={{ height: "60px", borderRadius: "25px", fontSize: "1.5rem" }}
          variant="contained"
          color="primary"
          className="create-discount-button"
          onClick={() => setOpen(true)}
        >
          Create Discount
        </Button>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Discount</DialogTitle>
        <Divider />
        <DialogContent>
          <Box
            className="create-discount-form"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              sx={{ width: "400px", background: "white" }}
              id="discountName"
              label="Discount Name"
              variant="outlined"
              inputRef={discountNameRef}
              className="input-container"
              fullWidth
              margin="normal"
            />

            <TextField
              sx={{ width: "400px", background: "white" }}
              id="discountCode"
              label="Discount Code"
              variant="outlined"
              inputRef={discountCodeRef}
              className="input-container"
              fullWidth
              margin="normal"
            />
            <TextField
              sx={{ width: "400px", background: "white" }}
              id="expirationDate"
              label="Expiration Date"
              variant="outlined"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              inputRef={expirationDateRef}
              className="input-container"
              fullWidth
              margin="normal"
            />
            <TextField
              sx={{ width: "400px", background: "white" }}
              id="minimumAmount"
              label="Minimum Amount"
              variant="outlined"
              inputRef={minimumAmountRef}
              className="input-container"
              fullWidth
              margin="normal"
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateDiscount} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <div className="discount-tables">
        <div className="table-section">
          <Typography variant="h6" gutterBottom>
            Product Discount
          </Typography>
          <Button
            sx={{ marginBottom: "10px" }}
            variant="contained"
            color="primary"
          >
            Add coupon
          </Button>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={productDiscounts}
              columns={productDiscountColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
            />
          </div>
        </div>
        <div className="table-section">
          <Typography variant="h6" gutterBottom>
            Shop Discount
          </Typography>
          <Button
            sx={{ marginBottom: "10px" }}
            variant="contained"
            color="primary"
          >
            Add coupon
          </Button>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={shopDiscounts}
              columns={shopDiscountColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
            />
          </div>
        </div>
      </div>
    </div>
  );
}

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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useLocation, useParams } from "react-router-dom";
import "./CreateDiscountPage.css";

export function CreateDiscountPage({ ownerView }) {
  const location = useLocation();
  const { shop_name } = useParams();
  const logged_user_id = localStorage.getItem("user_id");
  const storeId = ownerView ? null : location.state?.storeId;
  const [allowOthers, setAllowOthers] = useState<boolean>(false);
  const [openShopDialog, setOpenShopDialog] = useState<boolean>(false);
  const [openProductDialog, setOpenProductDialog] = useState<boolean>(false);
  const [shopDiscounts, setShopDiscounts] = useState<any[]>([]);
  const [productDiscounts, setProductDiscounts] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const discountCodeRef = useRef<HTMLInputElement>(null);
  const expirationDateRef = useRef<HTMLInputElement>(null);
  const minimumAmountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ownerView) {
      fetchOwnerShopDiscounts();
      fetchOwnerProductDiscounts();
      fetchUserShops();
    } else {
      fetchShopDiscounts();
      fetchProductDiscounts();
    }
  }, [ownerView]);

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

  const fetchOwnerShopDiscounts = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/discounts/shops/user/${logged_user_id}`
      );
      const data = await response.json();
      if (!data.error) setShopDiscounts(data.discounts);
    } catch (error) {
      console.error("Error fetching shop discounts:", error);
    }
  };

  const fetchOwnerProductDiscounts = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/discounts/products/user/${logged_user_id}`
      );
      const data = await response.json();
      if (!data.error) setProductDiscounts(data.discounts);
    } catch (error) {
      console.error("Error fetching product discounts:", error);
    }
  };

  const fetchUserShops = async () => {
    const response = await fetch(
      `http://localhost:5000/discounts/shops/user/${logged_user_id}`
    );
    const data = await response.json();
    setShops(data.discounts);
  };

  const fetchProductsByShop = async (shopId) => {
    const response = await fetch(
      `http://localhost:5000/discounts/products/by_shop/${shopId}`
    );
    const data = await response.json();
    setProducts(data.discounts);
  };

  const handleCreateDiscountShop = async () => {
    const discountCode = discountCodeRef.current?.value || "";
    const expirationDate = expirationDateRef.current?.value || "";
    const minimumAmount = minimumAmountRef.current?.value || "";

    try {
      const response = await fetch("http://localhost:5000/discounts/shops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shop_id: selectedShop,
          discount_code: discountCode,
          expiration_date: expirationDate,
          minimum_amount: minimumAmount,
          allow_others: allowOthers,
        }),
      });

      if (response.ok) {
        Swal.fire("Success", "Discount created successfully", "success");
        fetchShopDiscounts();
        setOpenShopDialog(false);
      } else {
        Swal.fire("Error", "Failed to create discount", "error");
      }
    } catch (error) {
      console.error("Error creating shop discount:", error);
      Swal.fire("Error", "An error occurred while creating the discount", "error");
    }
  };

  const handleCreateDiscountProduct = async () => {
    const discountCode = discountCodeRef.current?.value || "";
    const expirationDate = expirationDateRef.current?.value || "";
    const minimumAmount = minimumAmountRef.current?.value || "";

    try {
      const response = await fetch("http://localhost:5000/discounts/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: selectedProduct,
          discount_code: discountCode,
          expiration_date: expirationDate,
          minimum_amount: minimumAmount,
          allow_others: allowOthers,
        }),
      });

      if (response.ok) {
        Swal.fire("Success", "Discount created successfully", "success");
        fetchProductDiscounts();
        setOpenProductDialog(false);
      } else {
        Swal.fire("Error", "Failed to create discount", "error");
      }
    } catch (error) {
      console.error("Error creating product discount:", error);
      Swal.fire("Error", "An error occurred while creating the discount", "error");
    }
  };

  const handleEdit = async (id: number, isProductDiscount: boolean) => {
    const discountType = isProductDiscount ? "products" : "shops";
    try {
      const response = await fetch(
        `http://localhost:5000/discounts/${discountType}/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            discount_code: "NEW_CODE",
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        Swal.fire("Success", "Discount updated successfully", "success");
        if (isProductDiscount) {
          fetchProductDiscounts();
        } else {
          fetchShopDiscounts();
        }
      } else {
        Swal.fire("Error", data.error || "Failed to update discount", "error");
      }
    } catch (error) {
      console.error(`Error editing ${discountType} discount:`, error);
      Swal.fire("Error", "An error occurred while updating the discount", "error");
    }
  };

  const handleDelete = async (id: number, isProductDiscount: boolean) => {
    const discountType = isProductDiscount ? "products" : "shops";
    try {
      const response = await fetch(
        `http://localhost:5000/discounts/${discountType}/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (response.ok) {
        Swal.fire("Success", "Discount deleted successfully", "success");
        if (isProductDiscount) {
          fetchProductDiscounts();
        } else {
          fetchShopDiscounts();
        }
      } else {
        Swal.fire("Error", data.error || "Failed to delete discount", "error");
      }
    } catch (error) {
      console.error(`Error deleting ${discountType} discount:`, error);
      Swal.fire("Error", "An error occurred while deleting the discount", "error");
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
      <h2 className="manage-store-header">
        {ownerView ? "Discounts-Shops" : `Discounts-Shops - ${shop_name}`}
      </h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenShopDialog(true)}
      >
        Create Shop Discount
      </Button>
      <Box
        className="discounts-table"
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
          rows={shopDiscounts}
          columns={shopDiscountColumns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </Box>
      <Dialog open={openShopDialog} onClose={() => setOpenShopDialog(false)}>
        <DialogTitle>Create New Shop Discount</DialogTitle>
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
            {ownerView ? (
              <FormControl fullWidth margin="normal">
                <InputLabel>Shop</InputLabel>
                <Select
                  value={selectedShop}
                  onChange={(e) => {
                    setSelectedShop(e.target.value as string);
                    fetchProductsByShop(e.target.value);
                  }}
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value="" disabled>
                    Select a shop
                  </MenuItem>
                  {shops.map((shop) => (
                    <MenuItem key={shop.id} value={shop.id}>
                      {shop.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                sx={{ width: "400px", background: "white" }}
                id="shopName"
                label="Shop Name"
                variant="outlined"
                value={shop_name}
                disabled
                className="input-container"
                fullWidth
                margin="normal"
              />
            )}
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
          <Button onClick={() => setOpenShopDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateDiscountShop} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <h2 className="manage-store-header">
        {ownerView ? "Discounts-Products" : `Discounts-Products - ${shop_name}`}
      </h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenProductDialog(true)}
      >
        Create Product Discount
      </Button>
      <Box
        className="discounts-table"
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
          rows={productDiscounts}
          columns={productDiscountColumns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </Box>
      <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)}>
        <DialogTitle>Create New Product Discount</DialogTitle>
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
            {ownerView ? (
              <FormControl fullWidth margin="normal">
                <InputLabel>Product</InputLabel>
                <Select
                  value={selectedProduct}
                  onChange={(e) =>
                    setSelectedProduct(e.target.value as string)
                  }
                  displayEmpty
                  fullWidth
                  disabled={!selectedShop}
                >
                  <MenuItem value="" disabled>
                    Select a product
                  </MenuItem>
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                sx={{ width: "400px", background: "white" }}
                id="productName"
                label="Product Name"
                variant="outlined"
                select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value as string)}
                className="input-container"
                fullWidth
                margin="normal"
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
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
          <Button onClick={() => setOpenProductDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateDiscountProduct} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

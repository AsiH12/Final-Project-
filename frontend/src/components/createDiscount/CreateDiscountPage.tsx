import React, { useState, useEffect } from "react";
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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useLocation, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import "./CreateDiscountPage.css";

export function CreateDiscountPage({ ownerView }) {
  const location = useLocation();
  const { shop_name } = useParams();
  const logged_user_id = localStorage.getItem("user_id");
  const [openShopDialog, setOpenShopDialog] = useState<boolean>(false);
  const [openProductDialog, setOpenProductDialog] = useState<boolean>(false);
  const [shopDiscounts, setShopDiscounts] = useState<any[]>([]);
  const [productDiscounts, setProductDiscounts] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selctedShopDiscount, setSelectedShopDiscount] = useState<any | null>(
    null
  );
  const [selctedProductDiscount, setSelectedSProductDiscount] = useState<
    any | null
  >(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
  const [discount, setDiscount] = useState<number>(1);
  const [allowOthers, setAllowOthers] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [editDiscount, setEditDiscount] = useState<any>(null);
  const [hasShop, setHasShop] = useState<boolean>(false);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () => {
      if (ownerView) {
        console.log(ownerView);
        await fetchOwnerShopDiscounts();
        await fetchOwnerProductDiscounts();
        await fetchUserShops();
      } else {
        await fetchShopDiscounts();
        await fetchProductDiscounts();
        const shop_id = await fetchShopIdByName();
        const response = await fetch(
          `http://localhost:5000/products/shop/${shop_id}`
        );
        const data = await response.json();
        console.log(data.products);
        setProducts(data.products);
      }
      await fetchHasShop();
    };

    fetchData();
  }, [ownerView]);

  const fetchHasShop = async () => {
    try {
      // Check if the user owns or manages any shops
      const response = await fetch("http://localhost:5000/shops/manager", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token
        },
      });

      if (!response.ok) {
        // Error fetching user's shops
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to fetch shops. Please try again later.",
          customClass: {
            container: "swal-dialog-custom",
          },
        });
        return;
      }

      const { shops } = await response.json();

      if (!shops || shops.length < 1) {
        setHasShop(false);
      } else {
        setHasShop(true);
      }
    } catch (error) {
      console.error("Error fetching shop discounts:", error);
    }
  };

  const fetchShopDiscounts = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/discounts/shops/by_shop_name/${shop_name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send JWT token
          },
        }
      );
      const data = await response.json();
      console.log(data);
      if (!data.error) setShopDiscounts(data.discounts);
    } catch (error) {
      console.error("Error fetching shop discounts:", error);
    }
  };

  const fetchProductDiscounts = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/discounts/products/by_shop_name/${shop_name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send JWT token
          },
        }
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
        `http://localhost:5000/discounts/shops/user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send JWT token
          },
        }
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
        "http://localhost:5000/discounts/products/user",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send JWT token
          },
        }
      );
      const data = await response.json();
      if (!data.error) setProductDiscounts(data.discounts);
    } catch (error) {
      console.error("Error fetching product discounts:", error);
    }
  };

  const fetchUserShops = async () => {
    const response = await fetch("http://localhost:5000/shops/manager", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send JWT token
      },
    });
    const data = await response.json();
    setShops(data.shops);
  };

  const fetchProductsByShop = async (shopId: string) => {
    console.log(selectedShop);
    const response = await fetch(
      `http://localhost:5000/products/shop/${shopId}`
    );
    const data = await response.json();
    console.log(data.products);
    setProducts(data.products);
  };

  const fetchShopIdByName = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/shops/getidbyname/${shop_name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send JWT token if required
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.id;
      } else {
        console.error("Error fetching shop ID by name");
        return null;
      }
    } catch (error) {
      console.error("There was a problem fetching the shop ID:", error);
      return null;
    }
  };

  const handleCreateDiscountShop = async (data: any) => {
    try {
      let shopId = data.selectedShop;

      if (!ownerView) {
        shopId = await fetchShopIdByName();
        if (!shopId) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Unable to find the shop ID by name.",
            customClass: {
              container: "swal-dialog-custom",
            },
          });
          return;
        }
      }

      console.log(data);

      const response = await fetch("http://localhost:5000/discounts/shops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token
        },
        body: JSON.stringify({
          shop_id: shopId,
          discount_code: data.discountCode,
          discount: discount,
          expiration_date: data.expirationDate,
          minimum_amount: data.minimumAmount,
          allow_others: allowOthers,
        }),
      });

      if (response.ok) {
        if (ownerView) {
          await fetchOwnerShopDiscounts();
        } else {
          await fetchShopDiscounts();
        }
        Swal.fire({
          icon: "success",
          title: "Discount created successfully",
          customClass: {
            container: "swal-dialog-custom",
          },
        });
        setOpenShopDialog(false);
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Failed to create discount",
          text: errorData.error,
          customClass: {
            container: "swal-dialog-custom",
          },
        });
      }
    } catch (error) {
      console.error("Error creating shop discount:", error);

      Swal.fire({
        icon: "error",
        title: "An error occurred while creating the discount",
        text: error.message,
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    }
  };

  const handleCreateDiscountProduct = async (data: any) => {
    try {
      const response = await fetch("http://localhost:5000/discounts/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token
        },
        body: JSON.stringify({
          product_id: data.selectedProduct,
          discount_code: data.discountCode,
          discount: discount,
          expiration_date: data.expirationDate,
          minimum_amount: data.minimumAmount,
          allow_others: allowOthers,
        }),
      });

      if (response.ok) {
        if (ownerView) {
          await fetchOwnerProductDiscounts();
        } else {
          await fetchProductDiscounts();
        }
        Swal.fire({
          icon: "success",
          title: "Discount created successfully",
          customClass: {
            container: "swal-dialog-custom",
          },
        });

        setOpenProductDialog(false);
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Failed to create discount",
          text: errorData.error,
          customClass: {
            container: "swal-dialog-custom",
          },
        });
      }
    } catch (error) {
      console.error("Error creating product discount:", error);
      Swal.fire({
        icon: "error",
        title: "An error occurred while creating the discount",
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    }
  };

  const handleUpdateDiscount = async () => {
    const discountType = editDiscount.isProduct ? "products" : "shops";
    try {
      console.log("Updating discount with ID:", editDiscount.id);
      console.log("Discount data:", editDiscount);

      const response = await fetch(
        `http://localhost:5000/discounts/${discountType}/${editDiscount.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send JWT token
          },
          body: JSON.stringify(editDiscount),
        }
      );
      const data = await response.json();

      if (response.ok) {
        if (editDiscount.isProduct) {
          if (ownerView) {
            await fetchOwnerProductDiscounts();
          } else {
            await fetchProductDiscounts();
          }
        } else {
          if (ownerView) {
            await fetchOwnerShopDiscounts();
          } else {
            await fetchShopDiscounts();
          }
        }
        Swal.fire({
          icon: "success",
          title: "Discount updated successfully",
          customClass: {
            container: "swal-dialog-custom",
          },
        });
        setOpenEditDialog(false);
      } else {
        Swal.fire({
          icon: "error",
          title: data.error || "Failed to update discount",
          customClass: {
            container: "swal-dialog-custom",
          },
        });
      }
    } catch (error) {
      console.error("Error updating discount:", error);
      Swal.fire({
        icon: "error",
        title: "An error occurred while updating the discount",
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    }
  };

  const handleEdit = (row, isProduct) => {
    console.log("Editing row:", row);
    console.log("Is product discount:", isProduct);

    setEditDiscount({ ...row, isProduct });
    setOpenEditDialog(true);
  };

  const handleDelete = async (id: number, isProductDiscount: boolean) => {
    const discountType = isProductDiscount ? "products" : "shops";
    try {
      const response = await fetch(
        `http://localhost:5000/discounts/${discountType}/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send JWT token
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        if (isProductDiscount) {
          if (ownerView) {
            await fetchOwnerProductDiscounts();
          } else {
            await fetchProductDiscounts();
          }
        } else {
          if (ownerView) {
            await fetchOwnerShopDiscounts();
          } else {
            await fetchShopDiscounts();
          }
        }

        Swal.fire({
          icon: "success",
          title: "Discount deleted successfully",
          customClass: {
            container: "swal-dialog-custom",
          },
        });
      } else {
        Swal.fire({
          icon: "error",
          title: data.error || "Failed to delete discount",
          customClass: {
            container: "swal-dialog-custom",
          },
        });
      }
    } catch (error) {
      console.error(`Error deleting ${discountType} discount:`, error);
      Swal.fire({
        icon: "error",
        title: "An error occurred while trying to delete discount",
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    }
  };

  const handleClickOpenShopDiscount = async () => {
    if (hasShop) {
      setOpenShopDialog(true);
      reset();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "You must create a shop before using this feature.",
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    }
  };

  const handleClickOpenProductDiscount = async () => {
    if (hasShop) {
      setOpenProductDialog(true);
      reset();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "You must create a shop before using this feature.",
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    }
  };

  const productDiscountColumns: GridColDef[] = [
    { field: "shop_name", headerName: "Shop", width: 150 },
    { field: "product_name", headerName: "Product", width: 150 },
    {
      field: "categories",
      headerName: "Categories",
      width: 200,
      valueFormatter: (params) => params.value,
    },
    { field: "discount_code", headerName: "Discount Code", width: 150 },
    { field: "discount", headerName: "Discount", width: 150 },
    { field: "expiration_date", headerName: "Expiration Date", width: 150 },
    { field: "minimum_amount", headerName: "Minimum Amount", width: 150 },
    {
      field: "allow_others",
      headerName: "Allow Others",
      width: 150,
      type: "boolean",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row, true)}>
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
    { field: "shop_name", headerName: "Shop", width: 150 },
    {
      field: "categories",
      headerName: "Categories",
      width: 200,
      valueFormatter: (params) => params.value,
    },
    { field: "discount_code", headerName: "Discount Code", width: 150 },
    { field: "discount", headerName: "Discount", width: 150 },
    { field: "expiration_date", headerName: "Expiration Date", width: 150 },
    { field: "minimum_amount", headerName: "Minimum Amount", width: 150 },
    {
      field: "allow_others",
      headerName: "Allow Others",
      width: 150,
      type: "boolean",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row, false)}>
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
      <div className="grid-section">
        <h2 className="manage-store-header">
          {ownerView ? "Discounts-Shops" : `Discounts-Shops - ${shop_name}`}
        </h2>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpenShopDiscount}
        >
          Create Shop Discount
        </Button>
        <Box
          sx={{
            display: "flex",
            height: "60vh",
            width: "40vw",
          }}
        >
          <DataGrid
            rows={shopDiscounts}
            columns={shopDiscountColumns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      </div>

      <div className="grid-section">
        <h2 className="manage-store-header">
          {ownerView
            ? "Discounts-Products"
            : `Discounts-Products - ${shop_name}`}
        </h2>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpenProductDiscount}
        >
          Create Product Discount
        </Button>
        <Box
          sx={{
            display: "flex",
            height: "60vh",
            width: "40vw",
          }}
        >
          <DataGrid
            rows={productDiscounts}
            columns={productDiscountColumns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      </div>

      <Dialog open={openShopDialog} onClose={() => setOpenShopDialog(false)}>
        <DialogTitle>Create New Shop Discount</DialogTitle>
        <Divider />
        <form onSubmit={handleSubmit(handleCreateDiscountShop)}>
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
                <Controller
                  name="selectedShop"
                  control={control}
                  rules={{ required: "required" }}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      margin="normal"
                      error={!!errors.selectedShop}
                    >
                      <InputLabel>Shop</InputLabel>
                      <Select
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setSelectedShop(e.target.value as string);
                        }}
                        displayEmpty
                        fullWidth
                      >
                        <MenuItem value="" disabled>
                          Select a shop
                        </MenuItem>
                        {shops &&
                          shops.map((shop) => (
                            <MenuItem key={shop.id} value={shop.id}>
                              {shop.name}
                            </MenuItem>
                          ))}
                      </Select>
                      {errors.selectedShop && (
                        <Typography variant="caption" color="error">
                          {errors.selectedShop.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
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
              <Controller
                name="discountCode"
                control={control}
                rules={{ required: "required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: "400px", background: "white" }}
                    id="discountCode"
                    label="Discount Code"
                    variant="outlined"
                    className="input-container"
                    fullWidth
                    margin="normal"
                    error={!!errors.discountCode}
                    helperText={
                      errors.discountCode ? errors.discountCode.message : null
                    }
                  />
                )}
              />
              <TextField
                sx={{ width: "400px", background: "white" }}
                id="discount"
                label="Discount (1-100)"
                type="number"
                inputProps={{ min: 1, max: 100 }}
                variant="outlined"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="input-container"
                fullWidth
                margin="normal"
              />
              <Controller
                name="expirationDate"
                control={control}
                rules={{ required: "required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: "400px", background: "white" }}
                    id="expirationDate"
                    label="Expiration Date"
                    variant="outlined"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    className="input-container"
                    fullWidth
                    margin="normal"
                    error={!!errors.expirationDate}
                    helperText={
                      errors.expirationDate
                        ? errors.expirationDate.message
                        : null
                    }
                  />
                )}
              />
              <Controller
                name="minimumAmount"
                control={control}
                rules={{ required: "required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: "400px", background: "white" }}
                    id="minimumAmount"
                    label="Minimum Amount"
                    variant="outlined"
                    className="input-container"
                    fullWidth
                    margin="normal"
                    error={!!errors.minimumAmount}
                    helperText={
                      errors.minimumAmount ? errors.minimumAmount.message : null
                    }
                  />
                )}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowOthers}
                    onChange={(e) => setAllowOthers(e.target.checked)}
                    color="primary"
                  />
                }
                label="Allow Others"
                className="input-container"
                sx={{ marginTop: 2 }}
              />
            </Box>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button onClick={() => setOpenShopDialog(false)} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={openProductDialog}
        onClose={() => setOpenProductDialog(false)}
      >
        <DialogTitle>Create New Product Discount</DialogTitle>
        <Divider />
        <form onSubmit={handleSubmit(handleCreateDiscountProduct)}>
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
                <>
                  <Controller
                    name="selectedShop"
                    control={control}
                    rules={{ required: "required" }}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.selectedShop}
                      >
                        <InputLabel>Shop</InputLabel>
                        <Select
                          {...field}
                          onChange={async (e) => {
                            const shopId = e.target.value as string;
                            field.onChange(e);
                            setSelectedShop(shopId);
                            await fetchProductsByShop(shopId);
                          }}
                          displayEmpty
                          fullWidth
                        >
                          <MenuItem value="" disabled>
                            Select a shop
                          </MenuItem>
                          {shops &&
                            shops.map((shop) => (
                              <MenuItem key={shop.id} value={shop.id}>
                                {shop.name}
                              </MenuItem>
                            ))}
                        </Select>
                        {errors.selectedShop && (
                          <Typography variant="caption" color="error">
                            {errors.selectedShop.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="selectedProduct"
                    control={control}
                    rules={{ required: "required" }}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.selectedProduct}
                      >
                        <InputLabel>Product</InputLabel>
                        <Select
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setSelectedProduct(e.target.value as string);
                          }}
                          displayEmpty
                          fullWidth
                          disabled={!selectedShop}
                        >
                          <MenuItem value="" disabled>
                            Select a product
                          </MenuItem>
                          {products &&
                            products.map((product) => (
                              <MenuItem key={product.id} value={product.id}>
                                {product.name}
                              </MenuItem>
                            ))}
                        </Select>
                        {errors.selectedProduct && (
                          <Typography variant="caption" color="error">
                            {errors.selectedProduct.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </>
              ) : (
                <Controller
                  name="selectedProduct"
                  control={control}
                  rules={{ required: "required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx={{ width: "400px", background: "white" }}
                      id="productName"
                      label="Product Name"
                      variant="outlined"
                      select
                      className="input-container"
                      fullWidth
                      margin="normal"
                      error={!!errors.selectedProduct}
                      helperText={
                        errors.selectedProduct
                          ? errors.selectedProduct.message
                          : null
                      }
                    >
                      <MenuItem value="" disabled>
                        Select a product
                      </MenuItem>
                      {products &&
                        products.map((product) => (
                          <MenuItem key={product.id} value={product.id}>
                            {product.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  )}
                />
              )}
              <Controller
                name="discountCode"
                control={control}
                rules={{ required: "required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: "400px", background: "white" }}
                    id="discountCode"
                    label="Discount Code"
                    variant="outlined"
                    className="input-container"
                    fullWidth
                    margin="normal"
                    error={!!errors.discountCode}
                    helperText={
                      errors.discountCode ? errors.discountCode.message : null
                    }
                  />
                )}
              />
              <TextField
                sx={{ width: "400px", background: "white" }}
                id="discount"
                label="Discount (1-100)"
                type="number"
                inputProps={{ min: 1, max: 100 }}
                variant="outlined"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="input-container"
                fullWidth
                margin="normal"
              />
              <Controller
                name="expirationDate"
                control={control}
                rules={{ required: "required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: "400px", background: "white" }}
                    id="expirationDate"
                    label="Expiration Date"
                    variant="outlined"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    className="input-container"
                    fullWidth
                    margin="normal"
                    error={!!errors.expirationDate}
                    helperText={
                      errors.expirationDate
                        ? errors.expirationDate.message
                        : null
                    }
                  />
                )}
              />
              <Controller
                name="minimumAmount"
                control={control}
                rules={{ required: "required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: "400px", background: "white" }}
                    id="minimumAmount"
                    label="Minimum Amount"
                    variant="outlined"
                    className="input-container"
                    fullWidth
                    margin="normal"
                    error={!!errors.minimumAmount}
                    helperText={
                      errors.minimumAmount ? errors.minimumAmount.message : null
                    }
                  />
                )}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowOthers}
                    onChange={(e) => setAllowOthers(e.target.checked)}
                    color="primary"
                  />
                }
                label="Allow Others"
                className="input-container"
                sx={{ marginTop: 2 }}
              />
            </Box>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button onClick={() => setOpenProductDialog(false)} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Discount</DialogTitle>
        <Divider />
        <DialogContent>
          <Box
            className="edit-discount-form"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              sx={{ width: "400px", background: "white" }}
              id="editDiscountCode"
              label="Discount Code"
              variant="outlined"
              value={editDiscount?.discount_code || ""}
              onChange={(e) =>
                setEditDiscount({
                  ...editDiscount,
                  discount_code: e.target.value,
                })
              }
              className="input-container"
              fullWidth
              margin="normal"
            />
            <TextField
              sx={{ width: "400px", background: "white" }}
              id="editDiscount"
              label="Discount (1-100)"
              type="number"
              inputProps={{ min: 1, max: 100 }}
              variant="outlined"
              value={editDiscount?.discount || 1}
              onChange={(e) => {
                const value = Math.max(
                  1,
                  Math.min(100, Number(e.target.value))
                );
                setEditDiscount({
                  ...editDiscount,
                  discount: value,
                });
              }}
              className="input-container"
              fullWidth
              margin="normal"
            />

            <TextField
              sx={{ width: "400px", background: "white" }}
              id="editExpirationDate"
              label="Expiration Date"
              variant="outlined"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={editDiscount?.expiration_date || ""}
              onChange={(e) =>
                setEditDiscount({
                  ...editDiscount,
                  expiration_date: e.target.value,
                })
              }
              className="input-container"
              fullWidth
              margin="normal"
            />
            <TextField
              sx={{ width: "400px", background: "white" }}
              id="editMinimumAmount"
              label="Minimum Amount"
              variant="outlined"
              value={editDiscount?.minimum_amount || ""}
              onChange={(e) =>
                setEditDiscount({
                  ...editDiscount,
                  minimum_amount: e.target.value,
                })
              }
              className="input-container"
              fullWidth
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={editDiscount?.allow_others || false}
                  onChange={(e) =>
                    setEditDiscount({
                      ...editDiscount,
                      allow_others: e.target.checked,
                    })
                  }
                  color="primary"
                />
              }
              label="Allow Others"
              className="input-container"
              sx={{ marginTop: 2 }}
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateDiscount} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

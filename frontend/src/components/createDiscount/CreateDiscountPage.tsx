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
  FormControlLabel,
  Checkbox,
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

  const discountCodeRef = useRef<HTMLInputElement>(null);
  const expirationDateRef = useRef<HTMLInputElement>(null);
  const minimumAmountRef = useRef<HTMLInputElement>(null);
  const [discount, setDiscount] = useState<number>(1);
  const [allowOthers, setAllowOthers] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [editDiscount, setEditDiscount] = useState<any>(null);
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
      }
    };

    fetchData();
  }, [ownerView]);

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

  const handleCreateDiscountShop = async () => {
    const discountCode = discountCodeRef.current?.value || "";
    const expirationDate = expirationDateRef.current?.value || "";
    const minimumAmount = minimumAmountRef.current?.value || "";

    if (!selectedShop || !discountCode || !expirationDate || !minimumAmount) {
      Swal.fire({
        icon: "error",
        title: "All fields are required",
        customClass: {
          container: "swal-dialog-custom",
        },
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/discounts/shops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token
        },
        body: JSON.stringify({
          shop_id: selectedShop,
          discount_code: discountCode,
          discount: discount,
          expiration_date: expirationDate,
          minimum_amount: minimumAmount,
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

  const handleCreateDiscountProduct = async () => {
    const discountCode = discountCodeRef.current?.value || "";
    const expirationDate = expirationDateRef.current?.value || "";
    const minimumAmount = minimumAmountRef.current?.value || "";

    try {
      const response = await fetch("http://localhost:5000/discounts/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token
        },
        body: JSON.stringify({
          product_id: selectedProduct,
          discount_code: discountCode,
          discount: discount,
          expiration_date: expirationDate,
          minimum_amount: minimumAmount,
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
    console.log(row);
    if (isProduct) {
      setEditDiscount(row);
    } else {
      setEditDiscount(row);
    }

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
        title: "An errro occured while trying to delete discount",
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    }
  };

  const productDiscountColumns: GridColDef[] = [
    // { field: "id", headerName: "ID", width: 90 },
    { field: "shop_name", headerName: "Shop", width: 150 },
    { field: "product_name", headerName: "Product", width: 150 },
    {
      field: "categories",
      headerName: "Categories",
      width: 200,
      valueFormatter: (params) => (params.value || []).join(", "),
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
    // { field: "id", headerName: "ID", width: 90 },
    // { field: "shop_id", headerName: "Shop ID", width: 150 },
    { field: "shop_name", headerName: "Shop", width: 150 },
    {
      field: "categories",
      headerName: "Categories",
      width: 200,
      valueFormatter: (params) => (params.value || []).join(", "),
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
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25]}
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
            {/* Discount Percentage Input */}
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
            {/* Allow Others Checkbox */}
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
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
      <Dialog
        open={openProductDialog}
        onClose={() => setOpenProductDialog(false)}
      >
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
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Shop</InputLabel>
                  <Select
                    value={selectedShop}
                    onChange={async (e) => {
                      const shopId = e.target.value as string;
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
                </FormControl>
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
                    {products &&
                      products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </>
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
          <Button onClick={handleCreateDiscountProduct} color="primary">
            Create
          </Button>
        </DialogActions>
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
              onChange={(e) =>
                setEditDiscount({
                  ...editDiscount,
                  discount: Number(e.target.value),
                })
              }
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

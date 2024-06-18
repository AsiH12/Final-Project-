import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import "./ManagersPage.css";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Shop, User } from "../../utils/types";

interface Manager {
  id: number;
  username: string;
  email: string;
  storeId: number;
}

export function ManagersPage({ ownerView }: { ownerView: boolean }) {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [open, setOpen] = useState(false);
  const { shop_name } = useParams<{ shop_name: string }>();

  const token = localStorage.getItem("access_token");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<{ selectedUser: string; selectedShop: string }>();

  const fetchManagers = async () => {
    const url = ownerView
      ? `http://localhost:5000/managers/owner`
      : `http://localhost:5000/managers/shop_name/${shop_name}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send JWT token
      },
    });

    const data = await response.json();
    if (!data.error) setManagers(data.managers);
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

  const fetchUsers = async (shopName: string) => {
    const url = `http://localhost:5000/users/shop_name/${shopName}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send JWT token
      },
    });
    const data = await response.json();
    if (!data.error) return data.users || [];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchManagers();
      } catch (error) {
        console.error("Error fetching managers:", error);
      }

      if (ownerView) {
        try {
          await fetchUserShops();
        } catch (error) {
          console.error("Error fetching user shops:", error);
        }
      } else {
        try {
          const availableUsers = await fetchUsers(shop_name);
          setUsers(availableUsers);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }
    };

    fetchData();
  }, [ownerView]);

  const handleDeleteClick = async (id: number) => {
    const response = await fetch(`http://localhost:5000/managers/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send JWT token
      },
    });
    if (response.ok) {
      setManagers((prevManagers) =>
        prevManagers.filter((manager) => manager.id !== id)
      );
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Manager has been deleted successfully.",
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    } else {
      console.error("Error deleting manager");
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Error deleting manager.",
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    }
  };

  const fetchShopIdByName = async () => {
    try {
      console.log(shop_name);
      const response = await fetch(
        `http://localhost:5000/shops/getidbyname/${shop_name}`
      );
      if (response.ok) {
        const data = await response.json();
        return data.id; // Assuming the response JSON has shop_id
      } else {
        console.error("Error fetching shop ID by name");
        return null;
      }
    } catch (error) {
      console.error("There was a problem fetching the shop ID:", error);
      return null;
    }
  };

  const handleAddManager = async (data: {
    selectedUser: string;
    selectedShop: string;
  }) => {
    try {
      console.log(data);
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

      const response = await fetch(`http://localhost:5000/managers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token
        },
        body: JSON.stringify({
          manager_id: data.selectedUser,
          shop_id: shopId,
        }),
      });

      if (response.ok) {
        await fetchManagers();
        setOpen(false);
        reset();
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Manager has been added successfully.",
          customClass: {
            container: "swal-dialog-custom",
          },
        });
      } else {
        console.error("Error adding manager");
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Error adding manager.",
          customClass: {
            container: "swal-dialog-custom",
          },
        });
      }
    } catch (error) {
      console.error("There was a problem with the add operation:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "There was a problem with the add operation.",
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    }
  };

  const handleClickOpen = async () => {
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
      // User doesn't own or manage any shops, show an error message
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "You must create a shop before using this feature.",
        customClass: {
          container: "swal-dialog-custom",
        },
      });
      return;
    }
    if (ownerView) {
      await fetchUserShops();
    }
    setOpen(true);
  };

  const handleShopChange = async (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const shopId = event.target.value as string;
    setValue("selectedShop", shopId);
    const shopName = shops.find((shop) => shop.id === parseInt(shopId))?.name;
    if (shopName) {
      const availableUsers = await fetchUsers(shopName);
      setUsers(availableUsers);
    }
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const columns: GridColDef[] = [
    { field: "username", headerName: "Username", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "shop_name", headerName: "Shop", flex: 1 },
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

  const formValues = watch(); // Watch all form values
  const isFormValid =
    (formValues.selectedUser && formValues.selectedShop) ||
    (!ownerView && formValues.selectedUser);

  return (
    <div className="container">
      <h2 className="manage-store-header">
        {ownerView ? "Managers" : `Managers - ${shop_name}`}
      </h2>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        sx={{ marginBottom: "20px" }}
      >
        Add Manager
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Manager</DialogTitle>
        <DialogContent>
          {ownerView && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Shop</InputLabel>
              <Select
                {...register("selectedShop", { required: "Shop is required" })}
                onChange={handleShopChange}
                displayEmpty
                fullWidth
                error={!!errors.selectedShop}
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
              {errors.selectedShop && (
                <p className="error-text">
                  {errors.selectedShop.message as string}
                </p>
              )}
            </FormControl>
          )}
          <FormControl fullWidth margin="normal">
            <InputLabel>User</InputLabel>
            <Select
              {...register("selectedUser", { required: "User is required" })}
              displayEmpty
              fullWidth
              error={!!errors.selectedUser}
            >
              <MenuItem value="" disabled>
                Select a user
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
            {errors.selectedUser && (
              <p className="error-text">
                {errors.selectedUser.message as string}
              </p>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Back
          </Button>
          <Button
            onClick={handleSubmit(handleAddManager)}
            color="primary"
            disabled={!isFormValid}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          display: "flex",
          height: "80%",
          width: "50%",
        }}
      >
        <DataGrid
          rows={managers}
          columns={columns}
          pageSizeOptions={[5]}
          disableSelectionOnClick
          getRowId={(row) => row.id}
        />
      </Box>
    </div>
  );
}

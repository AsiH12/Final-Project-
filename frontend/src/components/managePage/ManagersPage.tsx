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
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import "./ManagersPage.css";
import { useLocation, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

interface Manager {
  id: number;
  username: string;
  email: string;
  storeId: number;
}

interface User {
  id: number;
  username: string;
  email: string;
}

interface Shop {
  id: number;
  name: string;
  description: string;
  owner_id: number;
  role: string;
}

export function ManagersPage({ ownerView }: { ownerView: boolean }) {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { shop_name } = useParams<{ shop_name: string }>();
  const { storeId, role, owner } = location.state || {
    storeId: null,
    role: null,
    owner: null,
  };
  const logged_user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("access_token");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

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

  useEffect(() => {
    fetchManagers().catch((error) =>
      console.error("Error fetching managers:", error)
    );

    if (ownerView) {
      fetchUserShops().catch((error) =>
        console.error("Error fetching user shops:", error)
      );
    }
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

  const handleAddManager = async (data: { selectedUser: string; selectedShop: string }) => {
    try {
      const response = await fetch(`http://localhost:5000/managers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token
        },
        body: JSON.stringify({
          manager_id: data.selectedUser,
          shop_id: data.selectedShop,
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
    }
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

  const handleClickOpen = async () => {
    if (ownerView) {
      await fetchUserShops();
    }
    setOpen(true);
  };

  const handleShopChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
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
    { field: "username", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "shop_name", headerName: "Shop", width: 150 },
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
      <h2 className="manage-store-header">
        {ownerView ? "Managers" : `Managers - ${shop_name}`}
      </h2>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Manager
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Manager</DialogTitle>
        <DialogContent>
          {ownerView && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Shop</InputLabel>
              <Select
                {...register("selectedShop", { required: "required" })}
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
                <p className="error-text">{errors.selectedShop.message}</p>
              )}
            </FormControl>
          )}
          <FormControl fullWidth margin="normal">
            <InputLabel>User</InputLabel>
            <Select
              {...register("selectedUser", { required: "required" })}
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
              <p className="error-text">{errors.selectedUser.message}</p>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Back
          </Button>
          <Button onClick={handleSubmit(handleAddManager)} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        className="managers-table"
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
          rows={managers}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
          getRowId={(row) => row.id}
        />
      </Box>
    </div>
  );
}

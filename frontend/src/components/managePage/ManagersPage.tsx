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
} from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import "./ManagersPage.css";
import { useLocation, useParams } from "react-router-dom";

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

export function ManagersPage() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const location = useLocation();
  const { shop_name } = useParams();
  const { storeId, role, owner } = location.state || {
    storeId: null,
    role: null,
    owner: null,
  };

  useEffect(() => {
    fetchManagers()
      .then((data) => setManagers(data))
      .catch((error) => console.error("Error fetching managers:", error));
  }, []);

  const fetchManagers = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/managers/shop_name/${shop_name}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data.managers || [];
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      return [];
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/users/shop_name/${shop_name}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.users || [];
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      return [];
    }
  };

  const handleDeleteClick = async (id: number) => {
    const response = await fetch(`http://localhost:5000/managers/${id}`, {
      method: "DELETE",
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

  const handleAddManager = async () => {
    if (!selectedUser) return;
    try {
      const response = await fetch(`http://localhost:5000/managers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ manager_id: selectedUser, shop_id: storeId }),
      });
      if (response.ok) {
        fetchManagers().then((data) => setManagers(data));
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Manager has been added successfully.",
          customClass: {
            container: "swal-dialog-custom",
          },
        });
        setOpen(false);
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

  const handleClickOpen = async () => {
    const availableUsers = await fetchUsers();
    setUsers(availableUsers);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns: GridColDef[] = [
    { field: "username", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
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
      <h2 className="manage-store-header">Managers</h2>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Manager
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Manager</DialogTitle>
        <DialogContent>
          <Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value as string)}
            displayEmpty
            fullWidth
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Back
          </Button>
          <Button onClick={handleAddManager} color="primary">
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

import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Autocomplete,
  Chip,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Shop } from "../utils/types";
import "./StoreForm.css";
import Swal from "sweetalert2";

interface StoreFormProps {
  open: boolean;
  onClose: () => void;
}

interface StoreFormData {
  storeName: string;
  description: string;
  categories: string[];
  ownerId: number;
  managers: string[];
}

interface Category {
  name: string;
}

interface Manager {
  username: string;
}

export function StoreForm({ open, onClose }: StoreFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Shop>();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data.categories))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/users")
      .then((response) => response.json())
      .then((data) => setManagers(data.users))
      .catch((error) => console.error("Error fetching managers:", error));
  }, []);


  const handleCreateStore = async (formData: Shop) => {
    const token = localStorage.getItem("access_token"); // Ensure token is retrieved here
    try {
      const response = await fetch(`http://127.0.0.1:5000/shops/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // console.log(response)
        Swal.fire({
          icon: "success",
          title: "Shop Created Successfully!",
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            container: "swal-dialog-custom",
          },
        });
        onClose();
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to create new shop",
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          container: "swal-dialog-custom",
        },
      });
      console.error("Error creating a shop: " + error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(handleCreateStore)}>
        <DialogTitle>Create a Store</DialogTitle>
        <Divider></Divider>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              id="name"
              label="Store Name"
              variant="outlined"
              className="input-container"
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : null}
              {...register("name", {
                required: "required",
              })}
              InputProps={{
                style: { backgroundColor: "white" },
              }}
            />

            <TextField
              id="description"
              label="Description"
              variant="outlined"
              className="input-container"
              fullWidth
              margin="normal"
              inputProps= {{
                maxLength: 200
              }}
              error={!!errors.description}
              helperText={errors.description ? errors.description.message : null}
              {...register("description", {
                required: "required",
              })}
              InputProps={{
                style: { backgroundColor: "white" },
               
              }}
            />

            <Autocomplete
              multiple
              id="categories"
              fullWidth
              options={categories.map((category) => category.name)}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={index}
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Categories"
                  placeholder="Select Categories"
                  fullWidth
                  margin="normal"
                />
              )}
              value={selectedCategories}
              onChange={(event, value) => setSelectedCategories(value)}
            />
            <Autocomplete
              id="managers"
              multiple
              fullWidth
              options={managers.map((manager) => manager.username)}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={index}
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Managers"
                  placeholder="Enter Manager IDs"
                  fullWidth
                  margin="normal"
                />
              )}
              value={selectedManagers}
              onChange={(event, value) => setSelectedManagers(value)}
            />
          </Box>
        </DialogContent>
        <Divider></Divider>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

import { useEffect, useState } from "react";
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
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import { Category, Shop } from "../utils/types";
import { useNavigate } from "react-router-dom";
import apiURL from "../constants/apiUrl";

interface StoreFormProps {
  open: boolean;
  onClose: () => void;
}

interface Manager {
  username: string;
}

export function StoreForm({ open, onClose }: StoreFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const navigate = useNavigate(); // Initialize useNavigate

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Shop>();

  useEffect(() => {
    fetch(`${apiURL}/categories`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Categories fetched:", data);
        setCategories(
          data.categories.map((category: any) => ({
            category_name: category.category_name,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        alert(`Error fetching categories: ${error.message}`);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch(`${apiURL}/users/notme`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Managers fetched:", data);
        console.log(data.users);
        setManagers(
          data.users.map((user: any) => ({ username: user.username }))
        );
      })
      .catch((error) => {
        console.error("Error fetching managers:", error);
        alert(`Error fetching managers: ${error.message}`);
      });
  }, []);

  const handleCreateStore = async (formData: Shop) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${apiURL}/shops/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
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
        navigate("/choosestore");
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

      if (error instanceof Error) {
        console.error("Error creating a shop: " + error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(handleCreateStore)}>
        <DialogTitle>Create a Store</DialogTitle>
        <Divider />
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
              inputProps={{ maxLength: 200 }}
              error={!!errors.description}
              helperText={
                errors.description ? errors.description.message : null
              }
              {...register("description", {
                required: "required",
              })}
              InputProps={{
                style: { backgroundColor: "white" },
              }}
            />

            <Controller
              name="categories"
              control={control}
              rules={{ required: "required" }}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  id="categories"
                  fullWidth
                  options={categories.map((category) => category.category_name)}
                  getOptionLabel={(option) => option}
                  filterSelectedOptions
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
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
                      error={!!errors.categories}
                      helperText={
                        errors.categories ? errors.categories.message : null
                      }
                    />
                  )}
                  {...field}
                  value={selectedCategories}
                  onChange={(_, value) => {
                    setSelectedCategories(value);
                    field.onChange(value);
                  }}
                />
              )}
            />

            <Controller
              name="managers"
              control={control}
              render={({ field }) => (
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
                      error={!!errors.managers}
                      helperText={
                        errors.managers ? errors.managers.message : null
                      }
                    />
                  )}
                  {...field}
                  value={selectedManagers}
                  onChange={(_, value) => {
                    setSelectedManagers(value);
                    field.onChange(value);
                  }}
                />
              )}
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

import React, { useEffect, useRef, useState } from "react";
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
import "./StoreForm.css";

interface StoreFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StoreFormData) => void;
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

export function StoreForm({ open, onClose, onSubmit }: StoreFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);

  const storeNameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = () => {
    const storeName = storeNameRef.current?.value || "";
    const description = descriptionRef.current?.value || "";

    onSubmit({
      name: storeName,
      description,
      categories: selectedCategories,
      owner_id: 1,
      managers: selectedManagers,
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
            sx={{ width: "400px", background: "white" }}
            id="storeName"
            label="Store Name"
            variant="outlined"
            inputRef={storeNameRef}
            className="input-container"
            fullWidth
            margin="normal"
          />

          <TextField
            sx={{ width: "400px", background: "white" }}
            id="description"
            label="Description"
            variant="outlined"
            inputRef={descriptionRef}
            className="input-container"
            fullWidth
            margin="normal"
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
    </Dialog>
  );
}

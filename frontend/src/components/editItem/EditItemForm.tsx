import React, { useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import "./EditItemForm.css";
import { Product } from "../../utils/types";

interface EditItemFormProps {
  onSaveItem: (data: Product) => void;
}

export function EditItemForm({ onSaveItem }: EditItemFormProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const categoriesRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleSaveItem = () => {
    const name = nameRef.current?.value || "";
    const description = descriptionRef.current?.value || "";
    const category = categoriesRef.current?.value || "";
    const price = priceRef.current?.value
      ? parseFloat(priceRef.current.value)
      : undefined;
    const amount = amountRef.current?.value
      ? parseInt(amountRef.current.value)
      : undefined;

    onSaveItem({ name, description, categories: [category], price, amount });
    setOpen(false); // Close the dialog after saving item
  };

  return (
    <div className="container">
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Edit Item
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Item</DialogTitle>
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
              sx={{ width: "400px", background: "white" }}
              id="name"
              label="Name"
              variant="outlined"
              inputRef={nameRef}
              fullWidth
              margin="normal"
            />
            <TextField
              sx={{ width: "400px", background: "white" }}
              id="description"
              label="Description"
              variant="outlined"
              inputRef={descriptionRef}
              fullWidth
              margin="normal"
            />
            <TextField
              sx={{ width: "400px", background: "white" }}
              id="categories"
              label="Categories"
              variant="outlined"
              inputRef={categoriesRef}
              fullWidth
              margin="normal"
            />
            <TextField
              sx={{ width: "400px", background: "white" }}
              id="price"
              label="Price"
              variant="outlined"
              inputRef={priceRef}
              fullWidth
              margin="normal"
              type="number"
            />
            <TextField
              sx={{ width: "400px", background: "white" }}
              id="amount"
              label="Amount"
              variant="outlined"
              inputRef={amountRef}
              fullWidth
              margin="normal"
              type="number"
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveItem} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

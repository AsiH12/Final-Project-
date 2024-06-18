import React, { useRef, useState } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import './CreateItemForm.css';
import { Product } from '../../utils/types';

interface CreateItemFormProps {
  onCreateItem: (data: Product) => void;
}



export function CreateItemForm({ onCreateItem }: CreateItemFormProps) {
  const itemNameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const categoriesRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleCreateItem = () => {
    const itemName = itemNameRef.current?.value || '';
    const description = descriptionRef.current?.value || '';
    const categories = categoriesRef.current?.value || '';
    const price = priceRef.current?.value || '';
    const amount = amountRef.current?.value || '';

    onCreateItem({ itemName, description, categories, price, amount });
    setOpen(false); // Close the dialog after creating item
  };

  return (
    <div className="container">
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
      >
        Create New Item
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Item</DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <TextField
              sx={{ width: '400px', background: 'white' }}
              id="itemName"
              label="Item Name"
              variant="outlined"
              inputRef={itemNameRef}
              fullWidth
              margin="normal"
            />
            <TextField
              sx={{ width: '400px', background: 'white' }}
              id="description"
              label="Description"
              variant="outlined"
              inputRef={descriptionRef}
              fullWidth
              margin="normal"
            />
            <TextField
              sx={{ width: '400px', background: 'white' }}
              id="categories"
              label="Categories"
              variant="outlined"
              inputRef={categoriesRef}
              fullWidth
              margin="normal"
            />
            <TextField
              sx={{ width: '400px', background: 'white' }}
              id="price"
              label="Price"
              variant="outlined"
              inputRef={priceRef}
              fullWidth
              margin="normal"
            />
            <TextField
              sx={{ width: '400px', background: 'white' }}
              id="amount"
              label="Amount"
              variant="outlined"
              inputRef={amountRef}
              fullWidth
              margin="normal"
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateItem} color="primary">
            Create Item
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

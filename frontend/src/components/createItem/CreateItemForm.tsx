import React, { useRef } from 'react';
import { Box, TextField, Button } from '@mui/material';
import './CreateItemForm.css';

interface CreateItemFormProps {
  onCreateItem: (data: ItemFormData) => void;
}

interface ItemFormData {
  itemName: string;
  description: string;
  categories: string;
  price: string;
  amount: string;
}

export function CreateItemForm({ onCreateItem }: CreateItemFormProps) {
  const itemNameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const categoriesRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  const handleCreateItem = () => {
    const itemName = itemNameRef.current?.value || '';
    const description = descriptionRef.current?.value || '';
    const categories = categoriesRef.current?.value || '';
    const price = priceRef.current?.value || '';
    const amount = amountRef.current?.value || '';

    onCreateItem({ itemName, description, categories, price, amount });
  };

  return (
    <div className="container">
      <Box className="create-item-form">
        <h2 className="manage-store-header">Manage Store</h2>
        <h2 className="form-header">Create New Item</h2>
        <Box>
          <TextField
            sx={{ width: '400px', background: 'white' }}
            id="itemName"
            label="Item Name"
            variant="outlined"
            inputRef={itemNameRef}
            className="input-container"
            fullWidth
            margin="normal"
          />
        </Box>
        <Box>
          <TextField
            sx={{ width: '400px', background: 'white' }}
            id="description"
            label="Description"
            variant="outlined"
            inputRef={descriptionRef}
            className="input-container"
            fullWidth
            margin="normal"
          />
        </Box>
        <Box>
          <TextField
            sx={{ width: '400px', background: 'white' }}
            id="categories"
            label="Categories"
            variant="outlined"
            inputRef={categoriesRef}
            className="input-container"
            fullWidth
            margin="normal"
          />
        </Box>
        <Box>
          <TextField
            sx={{ width: '400px', background: 'white' }}
            id="price"
            label="Price"
            variant="outlined"
            inputRef={priceRef}
            className="input-container"
            fullWidth
            margin="normal"
          />
        </Box>
        <Box>
          <TextField
            sx={{ width: '400px', background: 'white' }}
            id="amount"
            label="Amount"
            variant="outlined"
            inputRef={amountRef}
            className="input-container"
            fullWidth
            margin="normal"
          />
        </Box>
        <div className="button-container">
          <Button
            sx={{ height: '60px', borderRadius: '25px', fontSize: '1.5rem' }}
            variant="contained"
            color="primary"
            className="create-item-button"
            onClick={handleCreateItem}
          >
            Create Item
          </Button>
        </div>
      </Box>
    </div>
  );
}

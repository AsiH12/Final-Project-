import React, { useRef } from 'react';
import { Box, TextField, Button } from '@mui/material';
import './EditItemForm.css';

interface EditItemFormProps {
  onSaveItem: (data: ItemFormData) => void;
}

interface ItemFormData {
  id: string;
  name: string;
  description: string;
  categories: string;
  price: string;
  amount: string;
  storeId: string;
}

export function EditItemForm({ onSaveItem }: EditItemFormProps) {
  const idRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const categoriesRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const storeIdRef = useRef<HTMLInputElement>(null);

  const handleSaveItem = () => {
    const id = idRef.current?.value || '';
    const name = nameRef.current?.value || '';
    const description = descriptionRef.current?.value || '';
    const categories = categoriesRef.current?.value || '';
    const price = priceRef.current?.value || '';
    const amount = amountRef.current?.value || '';
    const storeId = storeIdRef.current?.value || '';

    onSaveItem({ id, name, description, categories, price, amount, storeId });
  };

  return (
    <div className="container">
      <Box className="edit-item-form">
        <h2 className="manage-store-header">Manage Store</h2>
        <h2 className="form-header">Edit Item</h2>
        <Box>
          <TextField
            sx={{ width: '400px', background: 'white' }}
            id="id"
            label="ID"
            variant="outlined"
            inputRef={idRef}
            className="input-container"
            fullWidth
            margin="normal"
          />
        </Box>
        <Box>
          <TextField
            sx={{ width: '400px', background: 'white' }}
            id="name"
            label="Name"
            variant="outlined"
            inputRef={nameRef}
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
        <Box>
          <TextField
            sx={{ width: '400px', background: 'white' }}
            id="storeId"
            label="Store ID"
            variant="outlined"
            inputRef={storeIdRef}
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
            className="save-button"
            onClick={handleSaveItem}
          >
            Save
          </Button>
        </div>
      </Box>
    </div>
  );
}

import React, { useRef } from 'react';
import { Box, TextField, Button } from '@mui/material';
import './StoreForm.css';

interface StoreFormProps {
  onSubmit: (data: StoreFormData) => void;
}

interface StoreFormData {
  storeName: string;
  description: string;
  categories: string;
  ownerId: string;
  managers: string;
}

export function StoreForm({ onSubmit }: StoreFormProps) {
  const storeNameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const categoriesRef = useRef<HTMLInputElement>(null);
  const ownerIdRef = useRef<HTMLInputElement>(null);
  const managersRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const storeName = storeNameRef.current?.value || '';
    const description = descriptionRef.current?.value || '';
    const categories = categoriesRef.current?.value || '';
    const ownerId = ownerIdRef.current?.value || '';
    const managers = managersRef.current?.value || '';

    onSubmit({ storeName, description, categories, ownerId, managers });
  };

  return (
    <div className="container">
      <Box className="store-form">
        <h2 className="form-header">Create a Store</h2>
        <Box>
          <TextField
            sx={{
              width: '400px',
              background: 'white',
            }}
            id="storeName"
            label="Store Name"
            variant="outlined"
            inputRef={storeNameRef}
            className="input-container"
            fullWidth
            margin="normal"
          />
        </Box>
        <Box>
          <TextField
            sx={{
              width: '400px',
              background: 'white',
            }}
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
            sx={{
              width: '400px',
              background: 'white',
            }}
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
            sx={{
              width: '400px',
              background: 'white',
            }}
            id="ownerId"
            label="Owner ID"
            variant="outlined"
            inputRef={ownerIdRef}
            className="input-container"
            fullWidth
            margin="normal"
          />
        </Box>
        <Box>
          <TextField
            sx={{
              width: '400px',
              background: 'white',
            }}
            id="managers"
            label="Managers"
            variant="outlined"
            inputRef={managersRef}
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
            className="create-button"
            onClick={handleSubmit}
          >
            Create
          </Button>
        </div>
      </Box>
    </div>
  );
}

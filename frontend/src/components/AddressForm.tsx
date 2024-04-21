import React, { useRef } from 'react';
import { Box, TextField, Button } from '@mui/material';
import './AddressForm.css';

interface AddressFormProps {
  onSaveAddress: (data: AddressFormData) => void;
}

interface AddressFormData {
  address: string;
  city: string;
  country: string;
}

export function AddressForm({ onSaveAddress }: AddressFormProps) {
  const addressRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);

  const handleSaveAddress = () => {
    const address = addressRef.current?.value || '';
    const city = cityRef.current?.value || '';
    const country = countryRef.current?.value || '';

    onSaveAddress({ address, city, country });
  };

  return (
    <div className="container">
      <Box className="address-form">
        <h2 className="form-header">Add/Remove Address</h2>
        <Box>
          <TextField
            sx={{ width: '400px', background: 'white' }}
            id="address"
            label="Address"
            variant="outlined"
            inputRef={addressRef}
            className="input-container"
            fullWidth
            margin="normal"
          />
        </Box>
        <Box>
          <TextField
            sx={{ width: '400px', background: 'white' }}
            id="city"
            label="City"
            variant="outlined"
            inputRef={cityRef}
            className="input-container"
            fullWidth
            margin="normal"
          />
        </Box>
        <Box>
          <TextField
            sx={{ width: '400px', background: 'white' }}
            id="country"
            label="Country"
            variant="outlined"
            inputRef={countryRef}
            className="input-container"
            fullWidth
            margin="normal"
          />
        </Box>
        <div className="button-container">
          <Button
            sx={{ height: '60px', borderRadius: '25px', fontSize: '1.4rem' }} // Adjusted font size
            variant="contained"
            color="primary"
            className="save-address-button"
            onClick={handleSaveAddress}
          >
            Save Address
          </Button>
        </div>
        {/* Leave space for the table */}
        <div style={{ height: '300px', width: '100%', marginTop: '50px', backgroundColor: 'lightgray' }}>
          {/* Placeholder for the table */}
        </div>
      </Box>
    </div>
  );
}

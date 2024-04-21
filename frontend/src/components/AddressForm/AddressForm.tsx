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
import "./AddressForm.css";

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
  const [open, setOpen] = useState<boolean>(false);

  const handleSaveAddress = () => {
    const address = addressRef.current?.value || "";
    const city = cityRef.current?.value || "";
    const country = countryRef.current?.value || "";

    onSaveAddress({ address, city, country });
    setOpen(false); // Close the dialog after saving address
  };

  return (
    <div className="container">
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add/Remove Address
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add/Remove Address</DialogTitle>
        <Divider />
        <DialogContent>
          <Box
            className="address-form"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              sx={{ width: "400px", background: "white" }}
              id="address"
              label="Address"
              variant="outlined"
              inputRef={addressRef}
              fullWidth
              margin="normal"
            />
            <TextField
              sx={{ width: "400px", background: "white" }}
              id="city"
              label="City"
              variant="outlined"
              inputRef={cityRef}
              fullWidth
              margin="normal"
            />
            <TextField
              sx={{ width: "400px", background: "white" }}
              id="country"
              label="Country"
              variant="outlined"
              inputRef={countryRef}
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
          <Button onClick={handleSaveAddress} color="primary">
            Save Address
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

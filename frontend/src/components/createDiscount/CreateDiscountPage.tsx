import React, { useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from "@mui/material";
import "./CreateDiscountPage.css";

interface CreateDiscountPageProps {
  storeName: string;
}

export function CreateDiscountPage({ storeName }: CreateDiscountPageProps) {
  const [allowOthers, setAllowOthers] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const discountNameRef = useRef<HTMLInputElement>(null);
  const productIdRef = useRef<HTMLInputElement>(null);
  const storeIdRef = useRef<HTMLInputElement>(null);
  const discountCodeRef = useRef<HTMLInputElement>(null);
  const expirationDateRef = useRef<HTMLInputElement>(null);
  const minimumAmountRef = useRef<HTMLInputElement>(null);

  const handleCreateDiscount = () => {
    const discountName = discountNameRef.current?.value || "";
    const productId = productIdRef.current?.value || "";
    const storeId = storeIdRef.current?.value || "";
    const discountCode = discountCodeRef.current?.value || "";
    const expirationDate = expirationDateRef.current?.value || "";
    const minimumAmount = minimumAmountRef.current?.value || "";

    // Send the data to the server or handle as needed
    console.log("Discount Name:", discountName);
    console.log("Product ID:", productId);
    console.log("Store ID:", storeId);
    console.log("Discount Code:", discountCode);
    console.log("Expiration Date:", expirationDate);
    console.log("Minimum Amount:", minimumAmount);
    console.log("Allow Others:", allowOthers);

    // Close the dialog
    setOpen(false);
  };

  return (
    <div className="container">
      <h2 className="manage-store-header">Manage Store</h2>
      <h3 className="store-name">{storeName}</h3>
      <h2 className="create-discount-header">Create New Discount</h2>
      <div className="button-container">
        <Button
          sx={{ height: "60px", borderRadius: "25px", fontSize: "1.5rem" }}
          variant="contained"
          color="primary"
          className="create-discount-button"
          onClick={() => setOpen(true)}
        >
          Create Discount
        </Button>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Discount</DialogTitle>
        <Divider></Divider>
        <DialogContent>
          <Box
            className="create-discount-form"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              sx={{ width: "400px", background: "white" }}
              id="discountName"
              label="Discount Name"
              variant="outlined"
              inputRef={discountNameRef}
              className="input-container"
              fullWidth
              margin="normal"
            />
            <TextField
              sx={{ width: "400px", background: "white" }}
              id="productId"
              label="Product ID"
              variant="outlined"
              inputRef={productIdRef}
              className="input-container"
              fullWidth
              margin="normal"
            />
            <TextField
              sx={{ width: "400px", background: "white" }}
              id="storeId"
              label="Store ID"
              variant="outlined"
              inputRef={storeIdRef}
              className="input-container"
              fullWidth
              margin="normal"
            />
            <TextField
              sx={{ width: "400px", background: "white" }}
              id="discountCode"
              label="Discount Code"
              variant="outlined"
              inputRef={discountCodeRef}
              className="input-container"
              fullWidth
              margin="normal"
            />
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="expiration" />
        </LocalizationProvider> */}
            <TextField
              sx={{ width: "400px", background: "white" }}
              id="expirationDate"
              label="Expiration Date"
              variant="outlined"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              inputRef={expirationDateRef}
              className="input-container"
              fullWidth
              margin="normal"
            />
            <TextField
              sx={{ width: "400px", background: "white" }}
              id="minimumAmount"
              label="Minimum Amount"
              variant="outlined"
              inputRef={minimumAmountRef}
              className="input-container"
              fullWidth
              margin="normal"
            />{" "}
          </Box>
        </DialogContent>
        <Divider></Divider>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateDiscount} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

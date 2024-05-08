import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Define type for items in the cart
interface CartItem {
  id: number;
  name: string;
  shop: string;
  price: number;
  amount: number;
  discount: number;
  originalPrice: number;
  discountedPrice?: number;
}

const CartPage = () => {
  // State hooks
  const [cart, setCart] = useState<CartItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [discounts, setDiscounts] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Retrieve cart data from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Remove item from cart
  const removeFromCart = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartPrices(); // Update prices after removing an item
  };

  // Update item quantity in cart
  const updateAmount = (id: number, newAmount: number) => {
    if (newAmount < 1) {
      newAmount = 1; // Ensure the new amount is at least 1
    }
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        return { ...item, amount: newAmount };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartPrices(); // Update prices after changing the amount
  };

  // Delete a discount
  const deleteDiscount = async (index: number) => {
    const updatedDiscounts = [...discounts];
    updatedDiscounts.splice(index, 1);
    setDiscounts(updatedDiscounts);

    try {
      // Fetch updated cart data with discounts applied
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Please log in to apply discounts.");
      }

      const response = await fetch("http://127.0.0.1:5000/apply-discounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token
        },
        body: JSON.stringify({
          cart: cart,
          used_discounts: updatedDiscounts,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cartItems); // Update cart with new prices
      } else {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    }
  };

  // Function to apply discount
  const applyDiscount = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Please log in to apply discounts.");
      }

      const response = await fetch("http://127.0.0.1:5000/apply-discounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token
        },
        body: JSON.stringify({
          cart: cart,
          used_discounts: discounts, // Pass used discount codes
          new_discount_code: inputValue, // Pass new discount code
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cartItems); // Update cart
        setInputValue(""); // Clear input after applying discount
        setDiscounts([...discounts, inputValue]); // Add new discount code to list
      } else {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    }
  };

  // Handle submit for discount application
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      try {
        if (discounts.includes(inputValue)) {
          throw new Error("This discount code is already in use.");
        }
        await applyDiscount();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
          customClass: {
            container: "swal-dialog-custom",
          },
        });
      }
    }
  };

  // Function to update cart prices
  const updateCartPrices = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Please log in to apply discounts.");
      }

      const response = await fetch("http://127.0.0.1:5000/apply-discounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token
        },
        body: JSON.stringify({
          cart: cart,
          used_discounts: discounts,
          new_discount_code: null, // No new discount code
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cartItems); // Update cart
      } else {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    }
  };

  const navigate = useNavigate();

  const handlePurchaseComplete = () => {
    Swal.fire({
      icon: "success",
      title: "Purchase Completed Successfully",
      timer: 3000,
      showConfirmButton: false,
      willOpen: () => {
        const sweetAlertContainer = document.querySelector('.swal2-container');
        if (sweetAlertContainer) {
          sweetAlertContainer.style.zIndex = '1500'; // Set a higher z-index value for the SweetAlert2 container
        }
      },
      didOpen: () => {
        const sweetAlertPopup = document.querySelector('.swal2-popup');
        if (sweetAlertPopup) {
          sweetAlertPopup.style.zIndex = '1500'; // Set the same z-index value for the SweetAlert2 popup
        }
      },
    }).then(() => {
      navigate("/purchasehistory");
    });
  };

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: "13vh",
      }}
    >
      <div style={{ width: "70vw" }}>
        <Typography variant="h3" gutterBottom>
          Shopping Cart
        </Typography>
        <Grid container spacing={2}>
          {cart.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Card
                sx={{
                  width: "70vw",
                  height: "200px",
                  margin: "auto",
                  boxShadow: "50px",
                }}
              >
                <CardContent
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Typography variant="body1">{item.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Shop: {item.shop}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Amount: {item.amount}
                    </Typography>
                    <div>
                      <Typography variant="body1">
                        <span style={{ color: "black" }}>
                          Price per 1 item: $
                          {item.price ? item.price.toFixed(2) : item.price}
                        </span>
                      </Typography>
                      <CardActions>
                        <Button
                          variant="outlined"
                          onClick={() => updateAmount(item.id, item.amount - 1)}
                          disabled={item.amount <= 1}
                        >
                          -
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => updateAmount(item.id, item.amount + 1)}
                        >
                          +
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </CardActions>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Submit Order
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <div style={{ padding: "1rem" }}>
            <div>
              <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
                <TextField
                  label="Enter Discount"
                  variant="outlined"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  style={{ marginRight: "10px" }}
                />
                <Button variant="contained" type="submit" color="primary">
                  Add Discount
                </Button>
              </form>
              <List style={{ marginTop: "20px" }}>
                <Typography variant="h5">Discounts:</Typography>
                {discounts.map((discount, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={discount} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => deleteDiscount(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </div>
            <div style={{ marginTop: "20px" }}>
              <Typography variant="h5">Cart Items:</Typography>
              {cart.map((item) => (
                <Card key={item.id} style={{ marginTop: "10px" }}>
                  <CardContent>
                    <Typography variant="body1">{item.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Amount: {item.amount}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <span style={{ color: "black" }}>
                        Original Price: ${item.originalPrice * item.amount}
                      </span>
                    </Typography>
                    {item.discountedPrice !== item.originalPrice && (
                      <Typography variant="body2" color="textSecondary">
                        <span style={{ color: "black" }}>
                          Discounted Price: $
                          {item.discountedPrice * item.amount}
                        </span>
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div style={{ marginTop: "20px" }}>
              <Typography variant="h5">
                Total Price: $
                {cart
                  .reduce(
                    (acc, item) =>
                      acc +
                      (item.discountedPrice || item.originalPrice) *
                        item.amount,
                    0
                  )
                  .toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePurchaseComplete}
                style={{ marginTop: "10px" }}
              >
                Complete Purchase
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    </Container>
  );
};

export default CartPage;

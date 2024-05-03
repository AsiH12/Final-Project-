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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";

// Define type for items in the cart
interface CartItem {
  id: number;
  name: string;
  shop: string;
  price: number;
  amount: number;
}

const CartPage = () => {
  // Initialize cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    // Retrieve cart data from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Function to remove an item from the cart
  const removeFromCart = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCount(); // Call updateCount when cart changes
  };

  // Function to update the amount of an item in the cart
  const updateAmount = (id: number, newAmount: number) => {
    // Ensure the new amount is at least 1
    if (newAmount < 1) {
      newAmount = 1;
    }
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        return { ...item, amount: newAmount };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCount(); // Call updateCount when cart changes
  };

  // Function to delete a discount
  const deleteDiscount = (index: number) => {
    const updatedDiscounts = [...discounts];
    updatedDiscounts.splice(index, 1);
    setDiscounts(updatedDiscounts);
  };

  // Calculate total price of items in the cart
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.amount,
    0
  );

  // Inside handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      // Check if the discount code is already in use
      if (discounts.includes(inputValue)) {
        // Display pop-up dialog if the code is already in use
        Swal.fire({
          icon: "error",
          title: "Discount Code Already in Use",
          text: "This discount code is already in use.",
        });
        return; // Exit the function if the code is already in use
      }

      // Check if the discount code is usable for the cart
      const token = localStorage.getItem("access_token"); // Assuming you store the JWT token in localStorage
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Authentication Error",
          text: "Please log in to use discounts.",
        });
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:5000/discounts/products",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ discount_code: inputValue, cart: cart }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data.discount_usable) {
            setDiscounts([...discounts, inputValue]);
            setInputValue(""); // Clear input after submission
          } else {
            // Display pop-up dialog for invalid discount code
            let errorMessage = "Please enter a valid discount code.";
            if (data.reason === "code_not_exist") {
              errorMessage = "This discount code doesn't exist.";
            } else if (data.reason === "no_qualifying_product") {
              errorMessage =
                "None of the products in your cart qualify for this discount.";
            }
            Swal.fire({
              icon: "error",
              title: "Invalid Discount Code",
              text: errorMessage,
            });
          }
        } else {
          // Display pop-up dialog for server error
          Swal.fire({
            icon: "error",
            title: "Server Error",
            text: "Failed to check discount code. Please try again later.",
          });
        }
      } catch (error) {
        console.error("Error checking discount validity:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred. Please try again later.",
        });
      }
    }
  };

  // Function to check if a discount code is valid for the items in the cart
  const checkDiscountValidity = async (discountCode: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/discounts/products/by-code/${discountCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data; // Assuming the backend returns the discount object
      }
      const response2 = await fetch(
        `http://127.0.0.1:5000/discounts/shops/by-code/${discountCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response2.ok) {
        const data = await response2.json();
        return data; // Assuming the backend returns the discount object
      }
      return null;
    } catch (error) {
      console.error("Error checking discount validity:", error);
      return null;
    }
  };

  // Function to check if a discount code has allowOthers: true
  const checkAllowOthers = (discount: any) => {
    return discount.allow_others == 1;
  };

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
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
                  </div>
                  <div>
                    <Typography variant="body1">
                      ${(item.price * item.amount).toFixed(2)}
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      <div
        style={{
          width: "20vw",
          height: "80vh",
          marginTop: "50px",
          marginLeft: "2rem",
          padding: "1rem",
          border: "2px solid black",
          borderRadius: "1rem",
          //   boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div>
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ marginTop: "20px", width: "20vw" }}
          >
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
          {/* Discounts List */}
          <List style={{ marginTop: "20px" }}>
            <Typography variant="h5">Discounts:</Typography>
            {discounts.map((discount, index) => (
              <ListItem key={index}>
                <ListItemText primary={discount.discount_code} />
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
        <div style={{ marginTop: "auto" }}>
          <Typography variant="h4">Total: ${totalPrice.toFixed(2)}</Typography>
        </div>
      </div>
    </Container>
  );
};

export default CartPage;

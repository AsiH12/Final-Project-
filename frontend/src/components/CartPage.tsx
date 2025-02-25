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
  RadioGroup,
  FormControlLabel,
  Radio,
  CardMedia,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useCartCount } from "../CartContext"; // Ensure you import useCartCount
import { Address } from "../utils/types";
import Box from "@mui/material/Box";
import noimage from "../images/noimage.jpeg";
import apiURL from "../constants/apiUrl";

// Define type for items in the cart
interface CartItem {
  product_id: number;
  name: string;
  shop: string;
  price: number;
  amount: number;
  max_amount: number;
  discount: number;
  originalPrice: number;
  discountedPrice: number;
  shop_id?: number; // Add shop_id as optional
  image?: any;
}

const CartPage = () => {
  // State hooks
  const [cart, setCart] = useState<CartItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [discounts, setDiscounts] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const loggedUserId = localStorage.getItem("user_id");
  const token = localStorage.getItem("access_token");

  const { cartCount, updateCount } = useCartCount(); // Use the context
  const total = cart.reduce(
    (acc, item) => acc + item.discountedPrice * item.amount,
    0
  );
  const displayTotal = !isNaN(total)
    ? total.toFixed(2)
    : "Error calculating total";

  useEffect(() => {
    // Retrieve cart data from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);
  useEffect(() => {
    const fetchAddresses = async () => {
      // Fetch addresses from the server
      try {
        const response = await fetch(`${apiURL}/addresses/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send JWT token
          },
        });
        const data = await response.json(); // Await the response.json() call
        setAddresses(data.addresses);
      } catch (error: any) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, [token]); // Add token as a dependency to ensure it is defined

  useEffect(() => {
    // Retrieve cart data from localStorage
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCount();
    }
  }, [cart]);

  const handleSelectAddress = (event: any) => {
    setSelectedAddress(event.target.value);
  };

  // Remove item from cart
  const removeFromCart = (product_id: number) => {
    console.log(cart);
    const updatedCart = cart.filter((item) => item.product_id !== product_id);
    console.log(updatedCart);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCount();
  };

  // Update item quantity in cart
  const updateAmount = (product_id: number, amount: number) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        console.log(item);
        if (item.product_id === product_id && amount <= item.max_amount) {
          let newAmount = amount;
          updateCount();
          return { ...item, amount: newAmount };
        }
        return item;
      })
    );
  };

  // Delete a discount
  const deleteDiscount = async (index: number) => {
    const updatedDiscounts = [...discounts];
    updatedDiscounts.splice(index, 1);
    setDiscounts(updatedDiscounts);

    try {
      // Fetch updated cart data with discounts applied

      if (!token) {
        throw new Error("Please log in to apply discounts.");
      }

      const response = await fetch(`${apiURL}/apply-discounts`, {
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
        console.log(errorMessage);
        throw new Error(errorMessage.error);
      }
    } catch (error: any) {
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

  const applyDiscount = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Please log in to apply discounts.");
      }

      const response = await fetch(`${apiURL}/apply-discounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token
        },
        body: JSON.stringify({
          cart: cart,
          used_discounts: discounts,
          new_discount_code: inputValue,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setCart(data.cartItems); // Update cart
      setInputValue(""); // Clear input after applying discount
      setDiscounts([...discounts, inputValue]); // Add new discount code to list
    } catch (error: any) {
      console.error("Error applying discounts:", error);
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
      } catch (error: any) {
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

  const navigate = useNavigate();

  const handlePurchaseComplete = async () => {
    if (selectedAddress !== "") {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("Please log in to confirm purchase.");
        }

        // Fetch shop_id for each cart item
        const updatedCart = await Promise.all(
          cart.map(async (item) => {
            const response = await fetch(
              `${apiURL}/products/getShopId/${item.product_id}`
            );
            if (response.ok) {
              const data = await response.json();
              item.shop_id = data.shop_id; // Assign shop_id to item
            } else {
              throw new Error("Failed to fetch shop ID.");
            }
            return item;
          })
        );

        const responses = await Promise.all(
          updatedCart.map((item) => {
            const postData = {
              product_id: item.product_id,
              shop_id: item.shop_id,
              user_id: parseInt(loggedUserId!),
              quantity: item.amount,
              product_price: item.originalPrice,
              purchase_date: new Date().toISOString(),
              city: selectedAddress.split(", ")[1],
              country: selectedAddress.split(", ")[2],
              shipping_address: selectedAddress,
              shipping_completed: false,
              total_price: displayTotal,
            };

            return fetch(`${apiURL}/purchase-history`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(postData),
            });
          })
        );

        const failed = responses.some((response) => !response.ok);
        if (failed) {
          throw new Error("Failed to record some items in purchase history.");
        }

        setDiscounts([]);
        localStorage.removeItem("cart");
        updateCount();

        Swal.fire({
          icon: "success",
          title: "Purchase Completed Successfully",
          timer: 3000,
          showConfirmButton: false,
          customClass: {
            container: "swal-dialog-custom",
          },
        }).then(() => {
          navigate("/purchasehistory");
        });
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
          customClass: {
            container: "swal-dialog-custom",
          },
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "You have to select an address (you can make if you don't have one)",
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    }
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
        <Box
          style={{
            display: "flex",
            flexWrap: "wrap",
            height: "63vh",
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          <Grid container spacing={2.5}>
            {cart.map((item) => (
              <Grid item xs={12} key={item.product_id}>
                <Card
                  sx={{
                    width: "70vw",
                    marginBotoom: "20px",
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
                            {item.originalPrice
                              ? item.originalPrice.toFixed(2)
                              : item.originalPrice}
                          </span>
                        </Typography>
                        <CardActions>
                          <Button
                            variant="outlined"
                            onClick={() =>
                              updateAmount(item.product_id, item.amount - 1)
                            }
                            disabled={item.amount <= 1}
                          >
                            -
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() =>
                              updateAmount(item.product_id, item.amount + 1)
                            }
                          >
                            +
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => removeFromCart(item.product_id)}
                          >
                            Remove
                          </Button>
                        </CardActions>
                      </div>
                    </div>
                    <CardMedia
                      component="img"
                      sx={{
                        height: "auto",
                        width: "20%",
                        objectFit: "fill",
                        marginLeft: "auto",
                      }}
                      image={
                        item.image
                          ? `data:image/jpeg;base64,${item.image}`
                          : noimage
                      }
                      alt={item.name}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          disabled={
            !localStorage.getItem("cart") ||
            localStorage.getItem("cart") === "[]"
          }
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
                <Card key={item.product_id} style={{ marginTop: "10px" }}>
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
                    </div>
                    <CardMedia
                      component="img"
                      sx={{
                        height: "auto",
                        width: "20%",
                        objectFit: "fill",
                        marginLeft: "auto",
                      }}
                      image={
                        item.image
                          ? `data:image/jpeg;base64,${item.image}`
                          : noimage
                      }
                      alt={item.name}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div style={{ marginTop: "20px" }}>
              <Typography variant="h5">Total Price: ${displayTotal}</Typography>
              <Typography
                variant="h6"
                gutterBottom
                style={{ marginTop: "20px" }}
              >
                Select a Delivery Address
              </Typography>
              <RadioGroup
                value={selectedAddress}
                onChange={handleSelectAddress}
              >
                {addresses &&
                  addresses.map((address, index) => (
                    <FormControlLabel
                      key={index}
                      value={
                        address.address +
                        ", " +
                        address.city +
                        ", " +
                        address.country
                      }
                      control={<Radio />}
                      label={
                        address.address +
                        ", " +
                        address.city +
                        ", " +
                        address.country
                      }
                    />
                  ))}
              </RadioGroup>
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

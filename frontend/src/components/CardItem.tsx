import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCartCount } from "../CartContext"; // Ensure you import useCartCount
import { CartItem } from "../utils/types";

export default function CardItem({
  id,
  image,
  name,
  description,
  shop,
  price,
  categories,
  amount,
}: CartItem) {
  const isLoggedIn = !!localStorage.getItem("access_token");
  const { cartCount, updateCount } = useCartCount(); // Use the context

  const [quantity, setQuantity] = useState(() => {
    // Get the current cart from local storage or initialize it to an empty array
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Find the index of the item in the cart
    const index = cart.findIndex((item: any) => item.name === name);

    // If the item is in the cart, set quantity to its amount, otherwise set to 0
    return index !== -1 ? cart[index].amount : 0;
  });

  useEffect(() => {
    // Ensure the quantity does not exceed the amount
    if (quantity > amount) {
      setQuantity(amount);
    }
  }, [amount, quantity]);

  const handleCartUpdate = () => {
    // Get the current cart from local storage or initialize it to an empty array
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Find the index of the item in the cart
    const index = cart.findIndex((item: any) => item.name === name);

    // If quantity is 0, remove the item from the cart
    if (quantity === 0) {
      if (index !== -1) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCount();
      }
    } else {
      // If the item is already in the cart, update its quantity
      if (index !== -1) {
        cart[index].amount = quantity;
      } else {
        // If the item is not in the cart, add it
        cart.push({
          product_id: id,
          name: name,
          shop: shop,
          image: image,
          amount: quantity,
          max_amount: amount,
          discountedPrice: price,
          originalPrice: price,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCount();
    }
  };

  return (
    <Card sx={{ width: 300, boxShadow: 3, padding: "10px" }}>
      <CardMedia
        component="img"
        width="350"
        height="250"
        image={image}
        alt={name}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          fontSize="35px"
          marginTop="5px"
          sx={{ fontSize: "2rem" }}
        >
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          fontSize="20px"
          marginTop="10px"
          sx={{ fontSize: "1.2rem" }}
        >
          {description}
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center", // Center items vertically
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight="bold"
            marginTop="10px"
          >
            {shop}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight="bold"
            marginTop="10px"
            sx={{ fontSize: "1.5rem" }}
          >
            {price}
          </Typography>
        </div>
        <ul
          style={{
            listStyleType: "none",
            display: "flex",
            padding: 0,
            margin: 0,
            marginTop: "10px",
          }}
        >
          {categories && categories.map((category, index) => (
            <li key={index} style={{ paddingRight: "5px" }}>
              {category}
              {index !== categories.length - 1 && (
                <span style={{ paddingLeft: "5px" }}>•</span>
              )}
            </li>
          ))}
        </ul>
        {isLoggedIn && (
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="bold"
              marginTop="10px"
              display="inline-block"
              mr={2} // Add margin between text and input
            >
              Quantity:
            </Typography>
            <input
              type="number"
              min="0"
              max={amount}
              value={quantity > amount ? amount : quantity}
              onChange={(e) => {
                const newQuantity = parseInt(e.target.value, 10);
                if (newQuantity > amount) {
                  setQuantity(amount);
                } else {
                  setQuantity(newQuantity);
                }
              }}
              style={{ marginRight: "10px", width: "50px" }}
            />
            <Button variant="outlined" onClick={handleCartUpdate}>
              <ShoppingCartIcon />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

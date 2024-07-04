import { useEffect, useState } from "react";
import CardItem from "../components/CardItem";
import { Box } from "@mui/material";
import { Product } from "../utils/types";
import apiURL from "../constants/apiUrl"; // Ensure this import is correct

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`${apiURL}/products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setProducts(data.products))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div>
      <Box
        id="itemsBox"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignContent: "start",
          justifyContent: "center",
          paddingLeft: "1.5rem",
          height: "63vh",
          columnGap: "1.5rem",
          rowGap: "1.5rem",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {products.map((product, index) => (
          <CardItem
            key={index}
            id={product.id?.toString() || ""}
            image={product.image} // Replace with actual image URL
            name={product.name || ""}
            description={product.description || ""}
            shop={product.shop_name || ""}
            price={product.price ?? 0}
            categories={product.categories || []}
            amount={product.amount ?? 0}
          />
        ))}
      </Box>
    </div>
  );
}

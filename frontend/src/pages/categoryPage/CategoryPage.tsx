import React, { useEffect, useState } from "react";
import img1 from "../../images/img1.jpg";
import img2 from "../../images/img2.jpg";
import CardItem from "../../components/CardItem";
import { Box } from "@mui/material";
import "./CategoryPage.css";

// Define the interface for the product object
interface Product {
  name: string;
  description: string;
  shop_name: string;
  price: number;
  categories: string[];
}

export default function CategoryPage({ name }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/products/category/${name}`)
      .then((response) => response.json())
      .then((data) => setProducts(data.products))
      .catch((error) => console.error("Error fetching products:", error));
  }, [name]);

  return (
    <div className="container">
      <h1 style={{ width: "100vw", textAlign: "left", marginLeft: "15rem" }}>
        {name}
      </h1>
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
            image={img1} // Replace with actual image URL
            name={product.name}
            description={product.description}
            shop={product.shop_name}
            price={product.price}
            categories={product.categories}
          />
        ))}
      </Box>
    </div>
  );
}

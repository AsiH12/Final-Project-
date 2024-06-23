import { useEffect, useState } from "react";
import img1 from "../../images/img1.jpg";
import CardItem from "../../components/CardItem";
import { Box } from "@mui/material";
import "./CategoryPage.css";
import { Product } from "../../utils/types";

type CategoryPageProps = {
  name: string;
};

export default function CategoryPage({ name }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`http://localhost:5000/products/category/${name}`)
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
            id={product.id!}
            image={product.image} // Replace with actual image URL
            name={product.name}
            description={product.description || ""}
            shop={product.shop_name || ""}
            price={product.price || 0}
            categories={product.categories || []}
            amount={product.amount || 0}
          />
        ))}
      </Box>
    </div>
  );
}

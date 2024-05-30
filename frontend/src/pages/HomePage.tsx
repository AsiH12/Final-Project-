import React, { useEffect, useState } from 'react';
import CardItem from '../components/CardItem';
import { Box } from '@mui/material';
import img1 from "../images/img1.jpg";


// Define the interface for the product object
interface Product {
  name: string;
  description: string;
  shop_name: string;
  price: number;
  categories: string[];
  amount: number;
}

// Define the interface for the CardItem component's props
// interface CardItemProps {
//   image: string;
//   name: string;
//   description: string;
//   shop: string;
//   price: number;
//   categories: string[];
// }

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/products')
      .then(response => response.json())
      .then(data => setProducts(data.products))
      .catch(error => console.error('Error fetching products:', error));

  }, []);

  return (
    <div>
      <Box
        id="itemsBox"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'start',
          justifyContent: 'center',
          paddingLeft: '1.5rem',
          height: '63vh',
          columnGap: '1.5rem',
          rowGap: '1.5rem',
          overflowX: 'hidden',
          overflowY: 'auto',
        }}
      >
        {products.map((product, index) => (
          <CardItem
            key={index}
            id={product.id}
            image={img1} // Replace with actual image URL
            name={product.name}
            description={product.description}
            shop={product.shop_name}
            price={product.price}
            categories={product.categories}
            amount={product.amount}
          />
        ))}
      </Box>
    </div>
  );
}
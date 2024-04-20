import React from 'react';
import img1 from "../../public/images/img1.jpg";
import img2 from "../../public/images/img2.jpg";
import CardItem from '../components/CardItem';
import { Box } from '@mui/material';

export default function HomePage() {
    const items =[
        {image: img1, name: "new laptop", description: "very nice", shop: "KSP", price: 99.9, categories: ["TECH", "LIFESTYLE"]},
        {image: img2, name: "new laptop", description: "very nice", shop: "KSP", price: 99.9, categories: ["TECH", "LIFESTYLE"]},
        {image: img1, name: "new laptop", description: "very nice", shop: "KSP", price: 99.9, categories: ["TECH", "LIFESTYLE"]},
        {image: img2, name: "new laptop", description: "very nice", shop: "KSP", price: 99.9, categories: ["TECH", "LIFESTYLE"]},
        {image: img1, name: "new laptop", description: "very nice", shop: "KSP", price: 99.9, categories: ["TECH", "LIFESTYLE"]},
        {image: img2, name: "new laptop", description: "very nice", shop: "KSP", price: 99.9, categories: ["TECH", "LIFESTYLE"]},
        {image: img1, name: "new laptop", description: "very nice", shop: "KSP", price: 99.9, categories: ["TECH", "LIFESTYLE"]},
        {image: img2, name: "new laptop", description: "very nice", shop: "KSP", price: 99.9, categories: ["TECH", "LIFESTYLE"]},
        {image: img1, name: "new laptop", description: "very nice", shop: "KSP", price: 99.9, categories: ["TECH", "LIFESTYLE"]},
        {image: img2, name: "new laptop", description: "very nice", shop: "KSP", price: 99.9, categories: ["TECH", "LIFESTYLE"]},
        {image: img1, name: "new laptop", description: "very nice", shop: "KSP", price: 99.9, categories: ["TECH", "LIFESTYLE"]},
        {image: img2, name: "new laptop", description: "very nice", shop: "KSP", price: 99.9, categories: ["TECH", "LIFESTYLE"]},
        {image: img1, name: "new laptop", description: "very nice", shop: "KSP", price: 99.9, categories: ["TECH", "LIFESTYLE"]},
        {image: img2, name: "new laptop", description: "very nice", shop: "KSP", price: 99.9, categories: ["TECH", "LIFESTYLE"]}
    ];

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
                    overflowY: "auto"
                }}
            >
                {items.map((item, index) => (
                    <CardItem
                        key={index}
                        image={item.image}
                        name={item.name}
                        description={item.description}
                        shop={item.shop}
                        price={item.price}
                        categories={item.categories}
                    />
                ))}
            </Box>
        </div>
    );
}

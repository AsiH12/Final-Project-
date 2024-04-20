import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

export default function CardItem({
  image,
  name,
  description,
  shop,
  price,
  categories,
}) {
  return (
    <Card sx={{ width: 300, boxShadow: 3, padding: "10px"}}>
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
          sx={{fontSize : "2rem"}}
          >
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          fontSize="20px"
          marginTop="10px"
          sx={{fontSize : "1.2rem"}}

        >
          {description}
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
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
            sx={{fontSize : "1.5rem"}}
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
          {categories.map((category, index) => (
            <li key={index} style={{ paddingRight: "5px" }}>
              {category}
              {index !== categories.length - 1 && (
                <span style={{ paddingLeft: "5px" }}>•</span>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

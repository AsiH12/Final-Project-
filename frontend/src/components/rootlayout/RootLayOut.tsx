import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { StoreForm } from "../CreateStore";
import "./RootLayOut.css";

export default function RootLayOut() {
  const [showStoreForm, setShowStoreForm] = useState(false);

  const handleCreateStore = () => {
    setShowStoreForm(true);
  };

  const handleSubmit = async (data) => {
    console.log(data);

    // Handle form submission here
  //   {
  //     "name": "New Shop Name1",
  //     "description": "Description of the new shop",
  //     "categories": ["Tech", "LifeStyle"],
  //     "managers": ["admin2", "user2"],
  //     "owner_id": 3
  // }

  try {
    const response = await fetch(`http://127.0.0.1:5000/shops`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  
    console.log(response)

    // if (response.ok) {
    //   alert("shop created successfully" );
    // } else {
    //   throw new Error("Invalid credentials");
    // }
  } catch (error) {
    alert("Error creating a shop: " + error.message);
  }
  
  
    
    console.log(data);
    setShowStoreForm(false);
  };

  return (
    <div>
      <nav>
        <ul>
          <div style={{display: "flex", flexDirection: "row" , justifyContent: "space-between"}}>
            <div>
              <li>
                <a href="/home">HOME</a>
              </li>
              <li>
                <a href="/categories">CATEGORIES</a>
              </li>
            </div>
            <div>
            <li>
              <a  onClick={handleCreateStore}>
                CREATE A SHOP
              </a>
            </li>
            </div>
          </div>
        </ul>
      </nav>
      <Outlet />
      {showStoreForm && (
        <StoreForm
          open={showStoreForm}
          onClose={() => setShowStoreForm(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

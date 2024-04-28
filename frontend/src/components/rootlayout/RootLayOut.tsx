import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { StoreForm } from "../CreateStore";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./RootLayOut.css";

export default function RootLayOut() {
  const [showStoreForm, setShowStoreForm] = useState(false);

  const handleCreateStore = () => {
    setShowStoreForm(true);
  };

  const handleSubmit = async (data) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/shops/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Show SweetAlert2 popup if shop created successfully
        Swal.fire({
          icon: "success",
          title: "Shop Created Successfully!",
          showConfirmButton: false,
          timer: 1500 // Automatically close after 1.5 seconds
        });
        setShowStoreForm(false);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      alert("Error creating a shop: " + error.message);
    }
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

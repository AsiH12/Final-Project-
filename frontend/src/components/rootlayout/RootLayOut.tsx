import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { StoreForm } from "../CreateStore";
import Swal from "sweetalert2";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import "./RootLayOut.css";

export default function RootLayOut() {
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("access_token") ? true : false;

  const handleCreateStore = () => {
    setShowStoreForm(true);
    setAnchorEl(null); // Close the dropdown when creating a shop
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = async (data) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/shops/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Shop Created Successfully!",
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            container: "swal-dialog-custom",
          },
        });
        setShowStoreForm(false);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to create new shop",
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          container: "swal-dialog-custom",
        },
      });
      console.error("Error creating a shop: " + error.message);
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <nav>
          <ul>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div>
                <li>
                  <a onClick={() => navigate("/home")}>HOME</a>
                </li>
                <li className="dropdown">
                  <a className="category-link">CATEGORIES</a>
                  <div className="dropdown-content">
                    <a onClick={() => navigate("/categories/cars")}>Cars</a>
                    <a onClick={() => navigate("/categories/fashion")}>
                      Fashion
                    </a>
                    <a onClick={() => navigate("/categories/lifestyle")}>
                      LifeStyle
                    </a>
                    <a onClick={() => navigate("/categories/tech")}>Tech</a>
                  </div>
                </li>
              </div>
              <div>
                <li>
                  <a onClick={handleCreateStore}>CREATE A SHOP</a>
                  <IconButton
                    onClick={handleCreateStore}
                    onMouseEnter={handleMenuOpen}
                  >
                    <PersonIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem onClick={handleMenuClose}>Option A</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Option B</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Option C</MenuItem>
                  </Menu>
                </li>
              </div>
            </div>
          </ul>
        </nav>
      ) : (
        <nav>
          <ul>
            <div
              className="nav-wrapper"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <li>
                  <a onClick={() => navigate("/home")}>HOME</a>
                </li>
                <li className="dropdown">
                  <a className="category-link">CATEGORIES</a>
                  <div className="dropdown-content">
                    <a onClick={() => navigate("/categories/cars")}>Cars</a>
                    <a onClick={() => navigate("/categories/fashion")}>
                      Fashion
                    </a>
                    <a onClick={() => navigate("/categories/lifestyle")}>
                      LifeStyle
                    </a>
                    <a onClick={() => navigate("/categories/tech")}>Tech</a>
                  </div>
                </li>
              </div>
              <div>
                <li>
                  <a
                    onClick={() => navigate("/login")}
                    style={{ fontSize: "1.5rem" }}
                  >
                    SIGN IN
                  </a>
                </li>
                <span>|</span>
                <li>
                  <a
                    onClick={() => navigate("/register")}
                    style={{ fontSize: "1.5rem" }}
                  >
                    SIGN UP
                  </a>
                </li>
              </div>
            </div>
          </ul>
        </nav>
      )}

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

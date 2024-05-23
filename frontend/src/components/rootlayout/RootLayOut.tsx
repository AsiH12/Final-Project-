import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { StoreForm } from "../CreateStore";
import Swal from "sweetalert2";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { Person as PersonIcon, ShoppingCart } from "@mui/icons-material";
import { useCartCount } from "../../CartContext";
import "./RootLayOut.css";

export default function RootLayOut() {
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("access_token") ? true : false;
  const { cartCount, updateCount } = useCartCount();

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

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    localStorage.removeItem('user_id');
    navigate("/login");
  };

  const handleSubmit = async (data) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/shops/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // console.log(response)
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
                    <PersonIcon
                      style={{ color: "white" }}
                      sx={{ fontSize: "2.5rem" }}
                    />
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
                    <MenuItem onClick={() => navigate("/purchasehistory")}>
                      Purchase History
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/editprofile")}>
                      Edit Profile
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/items")}>
                      Manage Items
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/choosestore")}>
                      Manage Stores
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/managers")}>
                      Manage Managers
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/discount")}>
                      Manage Discounts
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/orders")}>
                      Orders
                    </MenuItem>

                    <Button onClick={handleLogout}>Log Out</Button>
                  </Menu>
                </li>
                <li>
                  <IconButton
                    onClick={() => {
                      navigate("/cart");
                      updateCount();
                    }}
                  >
                    <ShoppingCart style={{ color: "white" }} />
                    {cartCount > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: "-8px",
                          left: "12px",
                          backgroundColor: "red",
                          color: "white",
                          borderRadius: "50%",
                          padding: "4px",
                          fontSize: "12px",
                        }}
                      >
                        {cartCount}
                      </span>
                    )}
                  </IconButton>
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
                {location.pathname !== "/login" &&
                  location.pathname !== "/register" && (
                    <React.Fragment>
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
                    </React.Fragment>
                  )}
              </div>
            </div>
          </ul>
        </nav>
      )}

      <Outlet style={{ marginTop: "13vh" }} />

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

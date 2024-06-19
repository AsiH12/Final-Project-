import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { StoreForm } from "../CreateStore";
import Swal from "sweetalert2";
import { Box, Button, IconButton, Menu, MenuItem } from "@mui/material";
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

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const expiry = tokenData.exp * 1000; // Convert expiry time to milliseconds
        if (Date.now() >= expiry) {
          handleLogout();
          Swal.fire({
            icon: "error",
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
            showConfirmButton: true,
            customClass: {
              container: "swal-dialog-custom",
            },
          });
        }
      }
    };

    const intervalId = setInterval(checkTokenExpiry, 300000); // Check every 5 minutes

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  const handleCreateStore = () => {
    setShowStoreForm(true);
    setAnchorEl(null); // Close the dropdown when creating a shop
  };

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    navigate("/login");
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
      <Box
        sx={{
          height: "87vh",
          // maxHeight: "87vh",
          width: "100vw",
          maxWidth: "100vw",
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            width: "90%",
            height: "inherit",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {showStoreForm && (
        <StoreForm
          open={showStoreForm}
          onClose={() => setShowStoreForm(false)}
        />
      )}
    </div>
  );
}

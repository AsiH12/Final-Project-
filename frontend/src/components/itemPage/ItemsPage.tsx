import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import "./ItemsPage.css";
import { useParams, useLocation } from "react-router-dom";

interface Item {
  id: number;
  name: string;
  description: string;
  shop_name: string;
  price: number;
  amount: number;
  maximum_discount: number;
  categories: string[];
}

interface Category {
  id: number;
  name: string;
}

interface Shop {
  id: number;
  name: string;
  description: string;
  owner_id: number;
  role: string;
}

export function ItemsPage({ ownerView }: { ownerView: boolean }) {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const { shop_name } = useParams<{ shop_name: string }>();
  const location = useLocation();

  const { storeId, storeName } = location.state || {};
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [userShops, setUserShops] = useState<Shop[]>([]);
  const logged_user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchItems = async () => {
      const url = ownerView
        ? `http://localhost:5000/products/manager_owner`
        : `http://localhost:5000/products/shop/${storeId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token
        },
      });
      const data = await response.json();
      if (!data.error) setItems(data.products);
    };

    const fetchCategories = async () => {
      const response = await fetch(`http://localhost:5000/categories`);
      const data = await response.json();
      setAllCategories(data.categories);
    };

    const fetchUserShops = async () => {
      const response = await fetch("http://localhost:5000/shops/manager", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token
        },
      });
      const data = await response.json();
      setUserShops(data.shops);
    };

    fetchItems().catch((error) =>
      console.error("Error fetching items:", error)
    );
    fetchCategories().catch((error) =>
      console.error("Error fetching categories:", error)
    );

    if (ownerView) {
      fetchUserShops().catch((error) =>
        console.error("Error fetching user shops:", error)
      );
    }
  }, [storeId, ownerView]);

  const handleEditClick = (item: Item) => {
    setCurrentItem(item);
    setSelectedShop(
      userShops.find((shop) => shop.name === item.shop_name) || null
    );
    setIsEditing(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentItem(null);
    setSelectedShop(null);
    setIsEditing(false);
  };

  const handleDeleteClick = async (id: number) => {
    const response = await fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send JWT token
      },
    });
    if (response.ok) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Item has been deleted successfully.",
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    } else {
      console.error("Error deleting item");
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Error deleting item.",
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    }
  };

  const handleSave = async () => {
    if (currentItem) {
      const shopId = ownerView ? selectedShop?.id : storeId;
      if (!shopId) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "required.",
          customClass: {
            container: "swal-dialog-custom",
          },
        });
        return;
      }

      const url = isEditing
        ? `http://localhost:5000/products/${currentItem.id}`
        : `http://localhost:5000/products`;
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token
        },
        body: JSON.stringify({
          name: currentItem.name,
          description: currentItem.description,
          shop_id: shopId,
          price: currentItem.price,
          amount: currentItem.amount,
          maximum_discount: currentItem.maximum_discount,
          categories: allCategories
            .filter((category) =>
              currentItem.categories.includes(category.name)
            )
            .map((category) => category.id),
        }),
      });

      if (response.ok) {
        if (isEditing) {
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === currentItem.id ? currentItem : item
            )
          );
        } else {
          const newItem = await response.json();
          setItems((prevItems) => [...prevItems, newItem]);
        }
        Swal.fire({
          icon: "success",
          title: isEditing ? "Edited!" : "Created!",
          text:
            "Item has been " +
            (isEditing ? "edited" : "created") +
            " successfully.",
          customClass: {
            container: "swal-dialog-custom",
          },
        });
        handleClose();
      } else {
        console.error("Error saving item");
      }
    }
  };

  const handleDialogDelete = () => {
    if (currentItem) {
      handleDeleteClick(currentItem.id);
      handleClose();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (currentItem) {
      setCurrentItem({
        ...currentItem,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleCategoryChange = (event: any, value: Category[]) => {
    if (currentItem) {
      setCurrentItem({
        ...currentItem,
        categories: value.map((category) => category.name),
      });
    }
  };

  const handleShopChange = (event: any, value: Shop | null) => {
    setSelectedShop(value);
    if (currentItem && value) {
      setCurrentItem({
        ...currentItem,
        shop_name: value.name,
      });
    }
  };

  const handleAddClick = async () => {
    // Check if the user owns or manages any shops
    const response = await fetch("http://localhost:5000/shops/manager", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send JWT token
      },
    });

    if (!response.ok) {
      // Error fetching user's shops
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to fetch shops. Please try again later.",
        customClass: {
          container: "swal-dialog-custom",
        },
      });
      return;
    }

    const { shops } = await response.json();

    if (!shops || shops.length < 1) {
      // User doesn't own or manage any shops, show an error message
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "You must create a shop before using this feature.",
        customClass: {
          container: "swal-dialog-custom",
        },
      });
      return;
    }

    // Proceed with adding a new item
    setCurrentItem({
      id: 0,
      name: "",
      description: "",
      shop_name: storeName || "",
      price: 0,
      amount: 0,
      maximum_discount: 0,
      categories: [],
    });
    setSelectedShop(null);
    setIsEditing(false);
    setOpen(true);
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "shop_name", headerName: "Shop Name", width: 150 },
    { field: "price", headerName: "Price", width: 100 },
    { field: "amount", headerName: "Amount", width: 100 },
    { field: "maximum_discount", headerName: "Maximum Discount", width: 150 },
    { field: "categories", headerName: "Categories", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEditClick(params.row as Item)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(params.id as number)}
        />,
      ],
    },
  ];

  return (
    <div className="container">
      <h2 className="items-header">
        <span style={{ color: "#39cccc" }}>
          {ownerView ? "Items" : `Items - ${storeName}`}
        </span>
      </h2>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddClick}
      >
        Create Product
      </Button>
      <Box
        className="items-table"
        sx={{
          backgroundColor: "white",
          boxShadow: "10px 8px 4px 0px #00000040",
          borderRadius: "44px",
          width: "800px",
          height: "600px",
          padding: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <DataGrid
          rows={items}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          getRowId={(row) => row.id}
        />
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? "Edit Item" : "Create Item"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            required
            value={currentItem?.name || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            required
            value={currentItem?.description || ""}
            onChange={handleChange}
          />
          {ownerView ? (
            <Autocomplete
              options={userShops}
              getOptionLabel={(option) => option.name}
              value={selectedShop}
              onChange={handleShopChange}
              renderInput={(params) => (
                <TextField {...params} label="Shop Name" fullWidth required />
              )}
            />
          ) : (
            <TextField
              margin="dense"
              name="shop_name"
              label="Shop Name"
              type="text"
              fullWidth
              disabled
              value={currentItem?.shop_name || storeName || ""}
              onChange={handleChange}
            />
          )}
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            required
            value={currentItem?.price || ""}
            onChange={handleChange}
            inputProps={{ min: "0" }} // Prevents selection of negative numbers
          />

          <TextField
            margin="dense"
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            required
            value={currentItem?.amount || ""}
            onChange={handleChange}
            inputProps={{ min: "0" }} // Prevents selection of negative numbers
          />

          <TextField
            margin="dense"
            name="maximum_discount"
            label="Maximum Discount"
            type="number"
            fullWidth
            value={currentItem?.maximum_discount || ""}
            onChange={handleChange}
            inputProps={{ min: "0" }} // Prevents selection of negative numbers
          />

          <Autocomplete
            multiple
            options={allCategories}
            getOptionLabel={(option) => option.name}
            value={
              currentItem
                ? allCategories.filter((category) =>
                    currentItem.categories.includes(category.name)
                  )
                : []
            }
            onChange={handleCategoryChange}
            renderTags={(value: Category[], getTagProps) =>
              value.map((option, index) => (
                <Chip
                  key={option.id}
                  label={option.name}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Categories"
                placeholder="Select categories"
                required
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Back
          </Button>
          {isEditing && (
            <Button onClick={handleDialogDelete} color="secondary">
              Delete
            </Button>
          )}
          <Button
            onClick={handleSave}
            color="primary"
            disabled={
              !currentItem?.name ||
              !currentItem?.description ||
              !currentItem?.price ||
              !currentItem?.categories ||
              !currentItem?.shop_name ||
              !currentItem?.maximum_discount ||
              !currentItem?.amount
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

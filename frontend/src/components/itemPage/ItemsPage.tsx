import React, { useState, useEffect, ChangeEvent } from "react";
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
import { Category } from "../../utils/types";
import noimage from "../../images/noimage.jpeg";
import apiURL from "../../constants/apiUrl";

interface Item {
  id: number;
  name: string;
  description: string;
  shop_name: string;
  price: number;
  amount: number;
  maximum_discount: number;
  categories: string[];
  image: string | null;
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
        ? `${apiURL}/products/manager_owner`
        : `${apiURL}/products/shop/${storeId}`;
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
      const response = await fetch(`${apiURL}/categories`);
      const data = await response.json();
      console.log(data);
      setAllCategories(data.categories);
    };

    const fetchUserShops = async () => {
      const response = await fetch(`${apiURL}/shops/manager`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token
        },
      });
      const data = await response.json();
      setUserShops(data.shops);
    };

    fetchCategories().catch((error) =>
      console.error("Error fetching categories:", error)
    );

    fetchItems().catch((error) =>
      console.error("Error fetching items:", error)
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
    setImagePreview(item.image ? `data:image/jpeg;base64,${item.image}` : null);
    setIsEditing(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentItem(null);
    setSelectedShop(null);
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
  };

  const handleDeleteClick = async (id: number) => {
    const response = await fetch(`${apiURL}/products/${id}`, {
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

  const fetchItems = async () => {
    const url = ownerView
      ? `${apiURL}/products/manager_owner`
      : `${apiURL}/products/shop/${storeId}`;
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
  const handleSave = async () => {
    if (currentItem) {
      const shopId = ownerView ? selectedShop?.id : storeId;
      if (!shopId) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Shop ID is required.",
          customClass: {
            container: "swal-dialog-custom",
          },
        });
        return;
      }

      const url = isEditing
        ? `${apiURL}/products/${currentItem.id}`
        : `${apiURL}/products`;
      const method = isEditing ? "PATCH" : "POST";

      const productData = {
        name: currentItem.name,
        description: currentItem.description,
        shop_id: shopId,
        price: currentItem.price,
        amount: currentItem.amount,
        maximum_discount: currentItem.maximum_discount,
        categories: allCategories
          .filter((category) =>
            currentItem.categories.includes(category.category_name)
          )
          .map((category) => category.id),
      };

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send JWT token
          },
          body: JSON.stringify(productData),
        });

        if (response.ok) {
          const product = await response.json();
          let imageUploadSuccess = true;

          // Handle image upload or delete
          if (imageFile) {
            const imageUrl = `${apiURL}/images/product`;
            const imageFormData = new FormData();
            imageFormData.append("file", imageFile);
            imageFormData.append("product_id", product.id);

            const imageResponse = await fetch(imageUrl, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`, // Send JWT token
              },
              body: imageFormData,
            });

            if (!imageResponse.ok) {
              imageUploadSuccess = false;
            }
          } else if (currentItem.image && !imagePreview) {
            const deleteUrl = `${apiURL}/images/product/${currentItem.id}`;
            const deleteResponse = await fetch(deleteUrl, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`, // Send JWT token
              },
            });

            if (!deleteResponse.ok) {
              imageUploadSuccess = false;
            }
          }

          // Fetch the image by product ID after creation or update
          const fetchImageResponse = await fetch(
            `${apiURL}/images/product/${product.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Send JWT token
              },
            }
          );

          if (fetchImageResponse.ok) {
            const imageData = await fetchImageResponse.json();
            product.image =
              imageData.images.length > 0
                ? `data:image/jpeg;base64,${imageData.images[0]}`
                : null;
          } else {
            product.image = null;
          }

          await fetchItems();

          if ((imageFile || currentItem.image) && !imageUploadSuccess) {
            Swal.fire({
              icon: "warning",
              title: "Created with Warnings!",
              text: "Item has been created successfully, but the image upload failed.",
              customClass: {
                container: "swal-dialog-custom",
              },
            });
          } else {
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
          }

          handleClose();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Error saving item.",
            customClass: {
              container: "swal-dialog-custom",
            },
          });
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Error saving item.",
          customClass: {
            container: "swal-dialog-custom",
          },
        });
      }
    }
  };

  // Helper function to convert image file to base64
  const imageFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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
        categories: value.map((category) => category.category_name),
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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAddClick = async () => {
    // Check if the user owns or manages any shops
    const response = await fetch(`${apiURL}/shops/manager`, {
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
      image: null,
    });
    setSelectedShop(null);
    setIsEditing(false);
    setOpen(true);
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "shop_name", headerName: "Shop Name", flex: 1 },
    { field: "price", headerName: "Price", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "maximum_discount", headerName: "Maximum Discount", flex: 1 },
    { field: "categories", headerName: "Categories", flex: 1 },
    {
      field: "image",
      headerName: "Image",
      flex: 1,
      renderCell: (params) =>
        params.value == undefined ? (
          <img
            src={noimage}
            alt="No Image"
            style={{ width: "auto", height: "100%" }}
          />
        ) : (
          <img
            src={`data:image/jpeg;base64,${params.value}`}
            alt="No Image"
            style={{ width: "auto", height: "100%" }}
          />
        ),
    },
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
        sx={{ marginBottom: "20px" }}
      >
        Create Product
      </Button>
      <Box
        sx={{
          display: "flex",
          height: "80%",
          width: "100%",
        }}
      >
        <DataGrid
          rows={items}
          columns={columns}
          rowHeight={100}
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
            getOptionLabel={(option) => option.category_name}
            value={
              currentItem
                ? allCategories.filter((category) =>
                    currentItem.categories.includes(category.category_name)
                  )
                : []
            }
            onChange={handleCategoryChange}
            renderTags={(value: Category[], getTagProps) =>
              value.map((option, index) => (
                <Chip
                  key={option.id}
                  label={option.category_name}
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
          <TextField
            margin="dense"
            name="image"
            label="Upload Image"
            type="file"
            fullWidth
            onChange={handleFileChange}
            InputLabelProps={{ shrink: true }}
          />
          {imagePreview && (
            <>
              <img
                src={imagePreview}
                alt="Image Preview"
                style={{ width: "100%", height: "auto", marginTop: "10px" }}
              />
              <Button onClick={handleRemoveImage} color="secondary">
                Remove Image
              </Button>
            </>
          )}
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
              !currentItem?.shop_name ||
              !currentItem?.price ||
              !currentItem?.amount ||
              !currentItem?.maximum_discount ||
              !currentItem?.categories.length
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

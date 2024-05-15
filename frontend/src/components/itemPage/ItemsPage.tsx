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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import "./ItemsPage.css";

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

export function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const storeId = 4;
  const storeName = "shop4";
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch(`http://localhost:5000/products/shop/${storeId}`);
      const data = await response.json();
      setItems(data.products);
    };

    const fetchCategories = async () => {
      const response = await fetch(`http://localhost:5000/categories`);
      const data = await response.json();
      setAllCategories(data.categories);
    };

    fetchItems().catch((error) => console.error('Error fetching items:', error));
    fetchCategories().catch((error) => console.error('Error fetching categories:', error));
  }, [storeId]);

  const handleEditClick = (item: Item) => {
    setCurrentItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentItem(null);
  };

  const handleDeleteClick = async (id: number) => {
    const response = await fetch(`http://localhost:5000/products/${id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Item has been deleted successfully.',
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    } else {
      console.error('Error deleting item');
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Error deleting item.',
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    }
  };

  const handleSave = async () => {
    if (currentItem) {
      const response = await fetch(`http://localhost:5000/products/${currentItem.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...currentItem,
          categories: currentItem.categories.map(category => category.name)
        }),
      });
  
      if (response.ok) {
        setItems((prevItems) =>
          prevItems.map((item) => (item.id === currentItem.id ? currentItem : item))
        );
        handleClose();
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Item has been updated successfully.',
          customClass: {
            container: "swal-dialog-custom",
          },
        });
      } else {
        console.error('Error updating item');
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error updating item.',
          customClass: {
            container: "swal-dialog-custom",
          },
        });
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

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "shop_name", headerName: "Shop Name", width: 150 },
    { field: "price", headerName: "Price", width: 100 },
    { field: "amount", headerName: "Amount", width: 100 },
    { field: "maximum_discount", headerName: "Maximum Discount", width: 150 },
    { field: "categories", headerName: "Categories", width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
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
        <span style={{ color: "#39cccc" }}>Items - {storeName}</span>
      </h2>
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
        }}
      >
        <DataGrid
          rows={items}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
          getRowId={(row) => row.id}
        />
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={currentItem?.name || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={currentItem?.description || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={currentItem?.price || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            value={currentItem?.amount || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="maximum_discount"
            label="Maximum Discount"
            type="number"
            fullWidth
            value={currentItem?.maximum_discount || ''}
            onChange={handleChange}
          />
          <Autocomplete
            multiple
            options={allCategories}
            getOptionLabel={(option) => option.name}
            value={allCategories.filter((category) =>
              currentItem?.categories.includes(category.name)
            )}
            onChange={handleCategoryChange}
            renderTags={(value: Category[], getTagProps) =>
              value.map((option, index) => (
                <Chip key={option.id} label={option.name} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Categories"
                placeholder="Select categories"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Back
          </Button>
          <Button onClick={handleDialogDelete} color="secondary">
            Delete
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

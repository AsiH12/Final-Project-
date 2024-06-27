import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import "./ChooseStorePage.css";
import { useNavigate } from "react-router-dom";
import { Shop } from "../../utils/types";
import apiURL from "../../constants/apiUrl";

export function ChooseStorePage() {
  const [stores, setStores] = useState<Shop[]>([]);
  const [selectedStore, setSelectedStore] = useState<Shop | null>(null);
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("access_token");
  const user_id = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch(`${apiURL}/shops/manager`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send JWT token
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched stores:", data.shops);
        setStores(data.shops);
      } catch (error) {
        console.error("Error fetching stores:", (error as Error).message);
      }
    };

    fetchStores();
  }, [user_id, token]);

  const handleStoreSelect = (store: Shop) => {
    setSelectedStore(store);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStore(null);
  };

  const handleNavigation = (path: string) => {
    if (selectedStore) {
      navigate(`${path}/${selectedStore.name}`, {
        state: {
          storeId: selectedStore.id,
          storeName: selectedStore.name,
          role: selectedStore.role,
          owner: selectedStore.owner_id,
        },
      });
    }
  };

  const handleDelete = async (shop_id: number) => {
    try {
      const response = await fetch(`${apiURL}/shops/${shop_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete shop");
      }

      setStores(stores.filter((store) => store.id !== shop_id));
      Swal.fire("Deleted!", "The shop has been deleted.", "success");
    } catch (error) {
      Swal.fire("Error!", (error as Error).message, "error");
    }
  };

  return (
    <Box
      className="manage-stores-container"
      sx={{ marginTop: "13vh", padding: "20px", height: "100%" }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center"}}>
        <h2 className="manage-store-header" style={{ color: "#39cccc" }}>
          Manage Store
        </h2>
        <h2 className="choose-store-header" style={{ color: "#39cccc" }}>
          Choose Store:
        </h2>
      </Box>

      <Box
        className="store-list"
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        {stores && stores.length > 0 ? (
          stores.map((store, index) => (
            <Card
              key={`store-${index}`}
              className="store-card"
              sx={{
                minWidth: 300,
                width: "30vw",
                minHeight: 200,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
                position: "relative",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: "red",
                  width: 40,
                  height: 40,
                  "&:hover": {
                    backgroundColor: "rgba(255, 0, 0, 0.2)",
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(store.id!);
                }}
              >
                <DeleteIcon sx={{ fontSize: 24 }} />
              </IconButton>
              <CardContent
                sx={{ textAlign: "center" }}
                onClick={() => handleStoreSelect(store)}
              >
                <Typography variant="h5" component="div">
                  {store.name}
                </Typography>
                <Typography variant="body2" component="p">
                  {store.description}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="h6" component="div">
            No stores available
          </Typography>
        )}
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Manage {selectedStore?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Button
              onClick={() => handleNavigation("/items")}
              color="primary"
              sx={{ justifyContent: "flex-start", textAlign: "left" }}
            >
              Manage Items
            </Button>
            <Button
              onClick={() => handleNavigation("/managers")}
              color="primary"
              sx={{ justifyContent: "flex-start", textAlign: "left" }}
            >
              Manage Managers
            </Button>
            <Button
              onClick={() => handleNavigation("/discount")}
              color="primary"
              sx={{ justifyContent: "flex-start", textAlign: "left" }}
            >
              Manage Discounts
            </Button>
            <Button
              onClick={() => handleNavigation("/orders")}
              color="primary"
              sx={{ justifyContent: "flex-start", textAlign: "left" }}
            >
              Orders
            </Button>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

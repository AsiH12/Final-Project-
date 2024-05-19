import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import './ChooseStorePage.css';
import { useNavigate } from 'react-router-dom';

interface ChooseStorePageProps {
  onStoreSelect: (storeName: string) => void;
}

export function ChooseStorePage({ onStoreSelect }: ChooseStorePageProps) {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [open, setOpen] = useState(false);

  const user_id = localStorage.getItem("user_id");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch(`http://localhost:5000/shops/manager/${user_id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched stores:', data.shops);
        setStores(data.shops);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();
  }, [user_id]);

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStore(null);
  };

  const handleNavigation = (path) => {
    navigate(`${path}/${selectedStore.name}`, { state: { storeId: selectedStore.id, storeName: selectedStore.name, role: selectedStore.role, owner: selectedStore.owner_id } });
  };

  return (
    <div className="container">
      <h2 className="manage-store-header" style={{ color: '#39cccc' }}>
        Manage Store
      </h2>
      <h2 className="choose-store-header" style={{ color: '#39cccc' }}>
        Choose Store:
      </h2>
      <Box
        className="store-list"
        sx={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {stores && stores.length > 0 ? (
          stores.map((store, index) => (
            <Card
              key={`store-${index}`}
              className="store-card"
              onClick={() => handleStoreSelect(store)}
              sx={{
                minWidth: 300,
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '10px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
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
          <Button onClick={() => handleNavigation('/items')} color="primary">
            Manage Items
          </Button>
          <Button onClick={() => handleNavigation('/managers')} color="primary">
            Manage Managers
          </Button>
          <Button onClick={() => handleNavigation('/discount')} color="primary">
            Manage Discounts
          </Button>
          <Button onClick={() => handleNavigation('/orders')} color="primary">
            Orders
          </Button>
          <Button onClick={() => handleNavigation('/revenues')} color="primary">
            Revenues
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

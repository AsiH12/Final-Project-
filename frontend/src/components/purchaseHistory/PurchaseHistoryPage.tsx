import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter
} from '@mui/x-data-grid';
import './PurchaseHistoryPage.css';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport />
      <GridToolbarDensitySelector />
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

export function PurchaseHistoryPage() {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterModel, setFilterModel] = useState({
    items: [],
  });

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      const userId = localStorage.getItem('user_id');
      try {
        const response = await fetch(`http://localhost:5000/purchase-history/user/${userId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setPurchaseHistory(data);
      } catch (error) {
        console.error('Failed to fetch purchase history', error);
      }
      setLoading(false);
    };

    fetchPurchaseHistory();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90, editable: false },
    { field: 'product_name', headerName: 'Product', width: 150, editable: false },
    { field: 'shop_name', headerName: 'Shop', width: 150, editable: false },
    { field: 'user_name', headerName: 'User', width: 120, editable: false },
    { field: 'quantity', headerName: 'Quantity', width: 130, editable: false },
    { field: 'product_price', headerName: 'Product Price', type: 'number', width: 130, editable: false },
    { field: 'purchase_date', headerName: 'Purchase Date', width: 150, editable: false },
    { field: 'city', headerName: 'City', width: 120, editable: false },
    { field: 'country', headerName: 'Country', width: 120, editable: false },
    { field: 'shipping_address', headerName: 'Shipping Address', width: 200, editable: false },
    { field: 'shipping_completed', headerName: 'Shipping Completed', width: 180, editable: false, type: "boolean" },
    { field: 'total_price', headerName: 'Total Price', type: 'number', width: 130, editable: false },
  ];

  return (
    <Box sx={{ height: 400, width: '80%', margin: 'auto' }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={purchaseHistory}
          columns={columns}
          components={{
            Toolbar: CustomToolbar,
          }}
          filterModel={filterModel}
          onFilterModelChange={(model) => setFilterModel(model)}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25]}
          disableColumnMenu
        />
      )}
    </Box>
  );
}

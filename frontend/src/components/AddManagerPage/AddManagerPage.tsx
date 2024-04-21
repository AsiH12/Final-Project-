import React, { useRef } from 'react';
import { Box, Divider,TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

interface AddManagerPageProps {
  storeName: string;
}

export function AddManagerPage({ storeName }: AddManagerPageProps) {
  const [open, setOpen] = React.useState(false);
  const idRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLInputElement>(null);

  const handleAddManager = () => {
    const id = idRef.current?.value || '';
    const username = usernameRef.current?.value || '';
    const role = roleRef.current?.value || '';

    // Handle add manager logic
    console.log('ID:', id);
    console.log('Username:', username);
    console.log('Role:', role);

    // Close the dialog
    setOpen(false);
  };

  return (
    <div className="container">
      <h2 className="manage-store-header">Manage Store - {storeName}</h2>
      <div className="button-container">
        <Button
          sx={{ height: '60px', borderRadius: '25px', fontSize: '1.5rem' }}
          variant="contained"
          color="primary"
          className="add-manager-button"
          onClick={() => setOpen(true)}
        >
          Add Manager
        </Button>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Manager</DialogTitle>
        <Divider></Divider>
        <DialogContent>
          <Box
            className="add-manager-form"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              sx={{ width: '400px', marginBottom: '20px', '& input': { backgroundColor: 'white' } }}
              id="id"
              label="ID"
              variant="outlined"
              margin="normal"
              inputRef={idRef}
            />
            <TextField
              sx={{ width: '400px', marginBottom: '20px', '& input': { backgroundColor: 'white' } }}
              id="username"
              label="Username"
              variant="outlined"
              margin="normal"
              inputRef={usernameRef}
            />
            <TextField
              sx={{ width: '400px', marginBottom: '20px', '& input': { backgroundColor: 'white' } }}
              id="role"
              label="Role"
              variant="outlined"
              margin="normal"
              inputRef={roleRef}
            />
          </Box>
        </DialogContent>
        <Divider></Divider>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddManager} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import { useApp } from '../context/AppContext';

const AdminPage = () => {
  const { indicators, fetchIndicatorData, loading, error } = useApp();
  const [newIndicator, setNewIndicator] = useState({
    name: '',
    unit: '',
    category: ''
  });

  // Fetch data on mount
  /*useEffect(() => {
    fetchIndicatorData();
  }, [fetchIndicatorData]);

  const handleAddIndicator = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/indicator`, newIndicator, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      fetchIndicatorData(); // Refresh list
      setNewIndicator({ name: '', unit: '', category: '' }); // Reset form
    } catch (err) {
      console.error('Failed to add indicator:', err);
    }
  }; */

  /*const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/indicator/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      fetchIndicatorData(); // Refresh list
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };*/

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        Admin Panel
      </Typography>

      {/* Add New Indicator Form */}
      <Box sx={{ mb: 4, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Add New Indicator
        </Typography>
        <TextField
          label="Name"
          value={newIndicator.name}
          onChange={(e) => setNewIndicator({...newIndicator, name: e.target.value})}
          fullWidth
          margin="normal"
          size="small"
        />
        <TextField
          label="Unit"
          value={newIndicator.unit}
          onChange={(e) => setNewIndicator({...newIndicator, unit: e.target.value})}
          fullWidth
          margin="normal"
          size="small"
        />
        <TextField
          label="Description"
          value={newIndicator.description || ''}
          onChange={(e) => setNewIndicator({...newIndicator, description: e.target.value})}
          fullWidth
          margin="normal"
          size="small"
        />
        
        <TextField
          label="Category"
          value={newIndicator.category}
          onChange={(e) => setNewIndicator({...newIndicator, category: e.target.value})}
          fullWidth
          margin="normal"
          size="small"
        />
        <Button 
          variant="contained" 
          //onClick={handleAddIndicator}
          sx={{ mt: 2 }}
        >
          Add Indicator
        </Button>
      </Box>

      {/* Indicators List */}
      <Typography variant="subtitle1" gutterBottom>
        Current Indicators ({indicators?.length || 0})
      </Typography>
      <List sx={{ border: '1px solid #eee', borderRadius: 1 }}>
        {indicators?.map((indicator) => (
          <ListItem 
            key={indicator.id}
            secondaryAction={
              <Button 
                color="error"
                size="small"
                //onClick={() => handleDelete(indicator.id)}
              >
                Delete
              </Button>
            }
          >
            <ListItemText
              primary={indicator.name}
              secondary={`${indicator.unit} | ${indicator.category}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AdminPage;
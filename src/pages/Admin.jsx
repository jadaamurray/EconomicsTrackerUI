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
import { apiClient } from '../apiconfig';

const AdminPage = () => {
  const { indicatorData, fetchIndicatorData, loading } = useApp();
  const [error, setError] = useState(null);
  const [newIndicator, setNewIndicator] = useState({
    IndicatorName: '',
    Abbreviation: '',
    Unit: '',
    Description: '',
    Category: ''
  });
  const [iErrors, setIErrors] = useState({
    Name: '',
    Unit: '',
    Category: '',
    Description: ''
  });
  const iValidationRules = {
    IndicatorName: { maxLength: 100, minLength: 2, required: true },
    Abbreviation: { uppercase: true },
    Unit: { required: true },
    Description: { maxLength: 450, minLength: 3 },
    Category: { maxLength: 100, minLength: 3 }
  }
  //console.log('type of error: ', typeof setError); // Should log "function"


  // Fetch data on mount
  useEffect(() => {
    if (!loading && indicatorData.length === 0) {
      fetchIndicatorData();
    }
  }, [loading, indicatorData, fetchIndicatorData]);

  const handleInputChange = (field, value) => {
    let processedValue = value;

    if (iValidationRules[field]?.uppercase) {   // Apply uppercase if specified in rules
      processedValue = value.toUpperCase();
    }

    // Validate length
    if (iValidationRules[field]?.maxLength && value.length > iValidationRules[field].maxLength) {
      setIErrors(prev => ({
        ...prev,
        [field]: `Maximum ${iValidationRules[field].maxLength} characters allowed`
      }));
    } else if (iValidationRules[field]?.minLength && value.length < iValidationRules[field].minLength) {
      setIErrors(prev => ({
        ...prev,
        [field]: `At least ${iValidationRules[field].minLength} characters required`
      }));
    } else {
      setIErrors(prev => ({ ...prev, [field]: '' }));
    }

    setNewIndicator(prev => ({ ...prev, [field]: processedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    // Check for validation errors
    if (iErrors && Object.keys(iErrors).length > 0) {
      setError("Please fix the errors before submitting.");
      return; // Stop submission if errors exist

    } try {
      await handleAddIndicator();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add indicator");
      console.error('Submission error:', error);
    }
  };

  const handleAddIndicator = async () => {
    try {
      apiClient.post('/indicator', newIndicator);
      fetchIndicatorData(); // Refresh list
      setNewIndicator({ IndicatorName: '', Abbreviation: '', Unit: '', Description: '', Category: '' }); // Reset form
    } catch (error) {
      console.error('Failed to add indicator:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/indicator/${id}`)
      fetchIndicatorData(); // Refresh list
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

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
          value={newIndicator.IndicatorName}
          onChange={(e) => handleInputChange('IndicatorName', e.target.value)}
          fullWidth
          margin="normal"
          size="small"
          required
          error={!!iErrors.IndicatorName}
          helperText={iErrors.IndicatorName}
          slotProps={{ // has to comply with min and max length from backend
            input: {
              minLength: iValidationRules.IndicatorName.minLength,
              maxLength: iValidationRules.IndicatorName.maxLength
            },
          }}
        />
        <TextField
          label="Abbreviation"
          value={newIndicator.Abbreviation || ''}
          onChange={(e) => handleInputChange('Abbreviation', e.target.value)}
          fullWidth
          margin="normal"
          size="small"
          error={!!iErrors.Abbreviation}
          helperText={iErrors.Abbreviation}
        />
        <TextField
          label="Unit"
          value={newIndicator.Unit}
          onChange={(e) => setNewIndicator({ ...newIndicator, Unit: e.target.value })}
          fullWidth
          margin="normal"
          size="small"
          required
          error={!!iErrors.Unit}
          helperText={iErrors.Unit}
        />
        <TextField
          label="Description"
          value={newIndicator.Description || ''}
          onChange={(e) => setNewIndicator({ ...newIndicator, Description: e.target.value })}
          fullWidth
          margin="normal"
          size="small"
          error={!!iErrors.Description}
          helperText={iErrors.Description}
          slotProps={{ // has to comply with min and max length from backend
            input: {
              minLength: iValidationRules.Description.minLength,
              maxLength: iValidationRules.Description.maxLength
            },
          }}
        />

        <TextField
          label="Category"
          value={newIndicator.Category}
          onChange={(e) => setNewIndicator({ ...newIndicator, Category: e.target.value })}
          fullWidth
          margin="normal"
          size="small"
          error={!!iErrors.Category}
          helperText={iErrors.Category}
          slotProps={{ // has to comply with min and max length from backend
            input: {
              minLength: iValidationRules.Category.minLength,
              maxLength: iValidationRules.Category.maxLength
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Add Indicator
        </Button>
        {error && (
          <Typography color="error" sx={{ mt: 1, ml: 1, display: 'inline-block' }}>
            {error}
          </Typography>
        )}
      </Box>

      {/* Indicators List */}
      <Typography variant="subtitle1" gutterBottom>
        Current Indicators ({indicatorData?.length || 0})
      </Typography>
      <List sx={{ border: '1px solid #eee', borderRadius: 1 }}>
        {indicatorData?.map((indicator) => (
          <ListItem
            key={indicator.id}
            secondaryAction={
              <Button
                color="error"
                size="small"
                onClick={() => handleDelete(indicator.id)}
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
    </Box >
  );
};

export default AdminPage;
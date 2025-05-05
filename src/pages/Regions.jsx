import { React, useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Tabs, Tab, useTheme, List, ListItem, ListItemText, ToggleButton, ToggleButtonGroup, Paper, TextField, InputAdornment, Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Tooltip
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import regionsData from '../data/regions-geo.json'; // GeoJSON data
import EconomicMap from '../components/EconomicMap';
import { useApp } from '../context/AppContext';


const RegionsPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const { regionalData, fetchRegionalData, loading, indicatorData } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const categories = ['All', ...new Set(regionalData.map(region => region.category))].filter(Boolean);

  const filteredRegions = regionalData.filter(region => {
    const matchesCategory = selectedCategory === 'All' || region.category === selectedCategory;
    const matchesSearch = region.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });





useEffect(() => {
  if (!loading && regionalData.length === 0) {
    fetchRegionalData();
  }
}, [loading, regionalData]);


const handleTabChange = (event, newValue) => {
  setActiveTab(newValue);
};

const handleCategoryChange = (event, newCategory) => {
  if (newCategory !== null) {
    setSelectedCategory(newCategory);
  }
};

const onEachFeature = (feature, layer) => {
  layer.on({
    mouseover: () => setSelectedRegion(feature.properties.name),
    mouseout: () => setSelectedRegion(null),
    click: () => console.log(feature.properties)
  });
};


return (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" sx={{ mb: 3, color: theme.palette.primary.dark, fontWeight: 600 }}>
      Regional Economic Data
    </Typography>

    {/* Filter Bar */}
    <Paper elevation={2} sx={{ p: 2, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
      {/* Category Filter */}
      <ToggleButtonGroup
        value={selectedCategory}
        exclusive
        onChange={handleCategoryChange}
        aria-label="category filter"
        size="small"
      >
        {categories.map((category) => (
          <ToggleButton key={category} value={category}>
            {category}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* Search Field */}
      <TextField
        placeholder="Search regions..."
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ flexGrow: 1, maxWidth: 400 }}
      />

      {/* Active Filters Display */}
      {selectedCategory !== 'All' && (
        <Chip
          label={`Category: ${selectedCategory}`}
          onDelete={() => setSelectedCategory('All')}
        />
      )}
    </Paper>

    {/* Regions Grid */}
    <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {selectedCategory === 'All' ? 'All Regions' : `${selectedCategory} Regions`}
          {searchQuery && ` matching "${searchQuery}"`}
          {filteredRegions.length > 0 && ` (${filteredRegions.length})`}
        </Typography>

        {filteredRegions.length > 0 ? (
          <Grid container spacing={3}>
            {filteredRegions.map(region => (
              <Grid key={region.id}>
                <RegionCard 
                  region={region} 
                  isSelected={selectedRegion === region.name}
                  onHover={() => setSelectedRegion(region.name)}
                  onLeave={() => setSelectedRegion(null)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No regions found matching your criteria</Typography>
        )}
      </Box>

    
  </Box>
);
};
const getCustomCategoryColour = (category) => {
  const customColours = {
    'Economic': '#4caf50',  // Green
    'Demographic': '#2196f3', // Blue
    'Environmental': '#ff9800', // Orange
    'Health': '#f44336', // Red
    'Education': '#9c27b0' // Purple
  };
  
  return customColours[category] || '#607d8b'; // Default blue-grey
};
  // Region Card Component
const RegionCard = ({ region, isSelected, onHover, onLeave }) => {
  return (
    <Card 
      elevation={isSelected ? 6 : 2}
      sx={{ 
        height: '100%',
        border: isSelected ? '2px solid primary.main' : 'none',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)'
        }
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {region.name}
        </Typography>
        <Chip 
          label={region.category} 
          ssx={{
            backgroundColor: getCustomCategoryColour(region.category),
            color: '#ffffff', // White text for better contrast
            mb: 1
          }}
        />
        <Typography variant="body2" color="text.secondary">
          {region.description || 'No description available'}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Region Detail Panel Component
const RegionDetailPanel = ({ region, economicData, activeTab, onTabChange }) => {
  return (
    <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
      <CardContent>
        <Tabs value={activeTab} onChange={onTabChange} sx={{ mb: 2 }}>
          <Tab label="Overview" />
          <Tab label="GDP" />
          <Tab label="Employment" />
        </Tabs>

        {region ? (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {region}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <StatCard title="GDP (Billion)" value={economicData[region]?.gdp || 'N/A'} />
              </Grid>
              <Grid item xs={6}>
                <StatCard title="Growth (%)" value={economicData[region]?.growth || 'N/A'} />
              </Grid>
              <Grid item xs={6}>
                <StatCard title="Unemployment (%)" value={economicData[region]?.unemployment || 'N/A'} />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Typography color="text.secondary">
            Hover over a region to view details
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// Stat Card Component
const StatCard = ({ title, value }) => (
  <Card sx={{ p: 1.5, textAlign: 'center', height: '100%' }}>
    <Typography variant="subtitle2">{title}</Typography>
    <Typography variant="h6" sx={{ mt: 1 }}>{value}</Typography>
  </Card>
);

export default RegionsPage;

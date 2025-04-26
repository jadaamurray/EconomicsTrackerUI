import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Tooltip
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import regionsData from '../data/regions-geo.json'; // Your GeoJSON data
import EconomicMap from '../components/EconomicMap';


const RegionsPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = React.useState(0);
  const [selectedRegion, setSelectedRegion] = React.useState(null);

  // Sample economic data by region
  const economicData = {
    "North": { gdp: 450, growth: 2.3, unemployment: 5.1 },
    "South": { gdp: 380, growth: 1.8, unemployment: 6.4 },
    "East": { gdp: 290, growth: 3.1, unemployment: 4.7 },
    "West": { gdp: 520, growth: 2.7, unemployment: 5.9 }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: () => setSelectedRegion(feature.properties.name),
      mouseout: () => setSelectedRegion(null),
      click: () => console.log(feature.properties)
    });
  };

  const getRegionStyle = (feature) => {
    const regionName = feature.properties.name;
    return {
      fillColor: economicData[regionName] ?
        theme.palette.success.main : theme.palette.grey[300],
      weight: 2,
      opacity: 1,
      color: theme.palette.primary.dark,
      fillOpacity: 0.7
    };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{
        mb: 3,
        color: theme.palette.primary.dark,
        fontWeight: 600
      }}>
        Regional Economic Data
      </Typography>

      <Grid container spacing={3}>
        {/* Map Column */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '500px', p: 0 }}>
              <EconomicMap
                regionsData={regionsData}
                onRegionHover={onEachFeature}
                regionStyle={getRegionStyle}
              />
              {selectedRegion && (
                <Tooltip direction="top" sticky>
                  {selectedRegion}
                </Tooltip>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Data Column */}
        <Grid item xs={12} md={4}>
          <Card sx={{
            height: '100%',
            bgcolor: theme.palette.background.paper
          }}>
            <CardContent>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{ mb: 2 }}
              >
                <Tab label="Overview" />
                <Tab label="GDP" />
                <Tab label="Employment" />
              </Tabs>

              {selectedRegion ? (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {selectedRegion}
                  </Typography>
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 2
                  }}>
                    <StatCard
                      title="GDP (Billion)"
                      value={economicData[selectedRegion]?.gdp || 'N/A'}
                    />
                    <StatCard
                      title="Growth (%)"
                      value={economicData[selectedRegion]?.growth || 'N/A'}
                    />
                    <StatCard
                      title="Unemployment (%)"
                      value={economicData[selectedRegion]?.unemployment || 'N/A'}
                    />
                  </Box>
                </Box>
              ) : (
                <Typography color="text.secondary">
                  Hover over a region to view data
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Reusable stat card component
const StatCard = ({ title, value }) => (
  <Card sx={{
    p: 1.5,
    textAlign: 'center',
    bgcolor: 'background.default'
  }}>
    <Typography variant="subtitle2">{title}</Typography>
    <Typography variant="h6" sx={{ mt: 1 }}>
      {value}
    </Typography>
  </Card>
);

export default RegionsPage;
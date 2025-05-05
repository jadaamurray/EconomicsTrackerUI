import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Button,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemButton
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EconomicMap from '../components/EconomicMap';
import PublicIcon from '@mui/icons-material/Public';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import EqualizerIcon from '@mui/icons-material/Equalizer';

const Dashboard = () => {
  const { 
    user, 
    fetchEconomicData, 
    economicData, 
    fetchRegionalData, 
    regionalData,
    fetchIndicatorData,
    indicatorData,
    fetchSourceData,
    sourceData,
    loading
  } = useApp();
  
  //const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const navigate = useNavigate();
  const hasFetched = useRef(false);


  /*useEffect(() => {
    if (!loading) {
          fetchEconomicData(),
          fetchRegionalData(),
          fetchIndicatorData(),
          fetchSourceData()
    }

  }, [fetchEconomicData, fetchRegionalData, fetchIndicatorData, fetchSourceData, economicData, regionalData, indicatorData, sourceData]);*/
  useEffect(() => {
   // console.log('[EFFECT] Checking if indicators need to be fetched');
    if (indicatorData.length === 0) {
      //console.log('[EFFECT] Fetching indicators...');
        fetchIndicatorData();
    }
}, []);   

  useEffect(() => {
    //console.log('[EFFECT] Checking if regions need to be fetched');
    if (regionalData.length === 0) {
     // console.log('[EFFECT] Fetching regions...');
      fetchRegionalData();
    }
  }, []);

  useEffect(() => {
    //console.log('[EFFECT] Checking if data need to be fetched');
    if (economicData.length === 0) {
      //console.log('[EFFECT] Fetching data...');
        fetchEconomicData();
    }
}, []); 

useEffect(() => {
  //console.log('[EFFECT] Checking if sources need to be fetched');
  if (sourceData.length === 0) {
    //console.log('[EFFECT] Fetching sources...');
      fetchSourceData();
  }
}, []);   

  // Get summary data for a representative region (using first region if none selected)
  const getEconomicSummary = () => {
    const regionId = selectedRegion || (regionalData.length > 0 ? regionalData[0].id : null);
    if (!regionId || !economicData.length) return null;
    
    // Find all economic data entries for this region
  const regionEconomicData = economicData.filter(item => item.regionId === regionId);
  
  // get specific metrics by indicatorId
  return {
    gdp: regionEconomicData.find(item => item.indicatorId === 1)?.value || 'N/A',
    unemployment: regionEconomicData.find(item => item.indicatorId === 2)?.value || 'N/A',
    inflationRate: regionEconomicData.find(item => item.indicatorId === 3)?.value || 'N/A'
    };
  };

  const summaryData = getEconomicSummary();
  const topRegions = [...regionalData].sort((a, b) => b.economicScore - a.economicScore).slice(0, 3);
  const keyIndicators = indicatorData.filter(ind => [1, 2].includes(ind.id)); // GDP and Unemployment

  if (!user) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Welcome back {user.firstName}
          </Typography>
          <Typography color="text.secondary">
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>

      {/* 4-Section Dashboard Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Regions Card */}
        <Grid>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PublicIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Regions</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {loading ? (
                <CircularProgress />
              ) : (
                <List>
                  {topRegions.map(region => (
                    <ListItemButton 
                      key={region.id} 
                      onClick={() => setSelectedRegion(region.id)}
                      selected={selectedRegion === region.id}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {region.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={region.name}
                        //secondary={`${region.countries.length} countries`}
                      />
                    </ListItemButton>
                  ))}
                </List>
              )}
              <Button 
                fullWidth 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/regions')}
              >
                View All Regions
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Indicators Card */}
        <Grid>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Key Indicators</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {loading ? (
                <CircularProgress />
              ) : (
                <List>
                  {keyIndicators.map(indicator => (
                    <ListItem key={indicator.id}>
                      <ListItemText
                        primary={indicator.name}
                        secondary={`Unit: ${indicator.unit}`}
                      />
                      <Chip 
                        label={indicator.category} 
                        size="small" 
                        color="primary"
                      />
                    </ListItem>
                  ))}
                </List>
              )}
              <Button 
                fullWidth 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/indicators')}
              >
                View All Indicators
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Sources Card */}
        <Grid>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LibraryBooksIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Data Sources</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {loading ? (
                <CircularProgress />
              ) : (
                <List>
                  {sourceData.slice(0, 3).map(source => (
                    <ListItem key={source.id}>
                      <ListItemText
                        primary={source.name}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
              <Button 
                fullWidth 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/sources')}
              >
                View All Sources
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Economic Data Card */}
        <Grid>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EqualizerIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Economic Snapshot</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {loading ? (
                <CircularProgress />
              ) : summaryData ? (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    {regionalData.find(r => r.id === (selectedRegion || regionalData[0]?.id))?.name || 'No region selected'}
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                    <StatCard title="GDP" value={`${summaryData.gdp || 'N/A'}%`} />
                    <StatCard title="Unemployment" value={`${summaryData.unemployment || 'N/A'}%`} />
                    <StatCard title="Inflation" value={`${summaryData.inflationRate || 'N/A'}%`} />
                  </Box>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/economic-data')}
                  >
                    Detailed Analysis
                  </Button>
                </Box>
              ) : (
                <Typography>No economic data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Map Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Regional Overview Map
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ height: '500px' }}>
            <EconomicMap 
              regionalData={regionalData} 
              onRegionSelect={setSelectedRegion}
              selectedRegion={selectedRegion}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Economic Trends Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Economic Trends
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {loading ? (
            <CircularProgress />
          ) : economicData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={economicData.filter(d => d.regionId === selectedRegion)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="gdp" 
                  stroke="#8884d8" 
                  name="GDP Growth (%)" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="unemployment" 
                  stroke="#ff7043" 
                  name="Unemployment (%)" 
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Typography>No economic trend data available</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value }) => (
  <Box sx={{ 
    p: 1.5, 
    border: '1px solid', 
    borderColor: 'divider', 
    borderRadius: 1,
    textAlign: 'center'
  }}>
    <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
    <Typography variant="h6">{value}</Typography>
  </Box>
);

export default Dashboard;
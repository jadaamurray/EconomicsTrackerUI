import { useEffect, useState } from 'react';
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
  Divider
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EconomicMap from '../components/EconomicMap';


const Dashboard = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [economicData, setEconomicData] = useState(null);
  const [regionalData, setRegionalData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample economic data - replace with your actual API call
  const fetchEconomicData = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with real data from your API
      const mockData = [
        { month: 'Jan', gdp: 3.2, inflation: 2.1, unemployment: 3.8 },
        { month: 'Feb', gdp: 3.5, inflation: 2.3, unemployment: 3.7 },
        { month: 'Mar', gdp: 3.7, inflation: 2.5, unemployment: 3.6 },
        { month: 'Apr', gdp: 3.9, inflation: 2.7, unemployment: 3.5 },
        { month: 'May', gdp: 4.1, inflation: 2.9, unemployment: 3.4 },
      ];
      const regionalData = [
        {
          region: "United States",
          gdp: 2.3,
          inflation: 3.2,
          latitude: 37.0902,
          longitude: -95.7129
        },
        {
          region: "United Kingdom",
          gdp: 1.8,
          inflation: 2.9,
          latitude: 55.3781,
          longitude: -3.4360
        },
        {
          region: "Germany",
          gdp: 1.5,
          inflation: 2.7,
          latitude: 51.1657,
          longitude: 10.4515
        }
      ];
      
      setEconomicData(mockData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchEconomicData();
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Economic Dashboard</Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* User Profile Card */}
      <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Welcome back
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      <Typography variant="h4" gutterBottom>
        Regional Economic Data
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <EconomicMap regionalData={regionalData} />
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        

        {/* Key Metrics Card */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Key Economic Indicators
              </Typography>
              <Divider sx={{ my: 2 }} />
              {loading ? (
                <CircularProgress />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={economicData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="gdp" stroke="#8884d8" name="GDP Growth (%)" />
                    <Line type="monotone" dataKey="inflation" stroke="#82ca9d" name="Inflation (%)" />
                    <Line type="monotone" dataKey="unemployment" stroke="#ffc658" name="Unemployment (%)" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Data Cards */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Trends
              </Typography>
              {/* Add your actual data components here */}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Economic Calendar
              </Typography>
              {/* Add calendar component here */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
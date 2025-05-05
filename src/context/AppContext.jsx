import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService, apiClient } from '../apiconfig';
//import jwtDecode from 'jwt-decode';


const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('authToken')
  );
  const [economicData, setEconomicData] = useState([]);
  const [indicatorData, setIndicators] = useState([]);
  const [regionalData, setRegions] = useState([]);
  const [sourceData, setSources] = useState([]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);


  // Checking auth status on app load
  /*useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const decoded = jwtDecode(token);

        // Check token expiration
        if (decoded.exp * 1000 < Date.now()) {
          throw new Error('Token expired');
        }

        // Reconstruct user from token and localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser({
          ...storedUser,
          id: decoded.sub || storedUser?.id, // Use JWT subject as user ID
          roles: decoded.roles || storedUser?.roles || ['User']
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token validation failed:', error);
        logout(); // clear invalid token
      } finally {
        setLoading(false);
      }
    };
  }, []); */

  // Register function
  const register = async (formData) => {
    setLoading(true);
    try {
      const response = await apiClient.post('Account/register', formData);
    } catch (error) {
      console.error('Register Error Details:', {
        error: error.message,
        response: error.response?.data
      });
      throw error; // Re-throw for component handling
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (formData) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/Account/login', formData);
      if (!response.data?.token) {
        throw new Error(response.data?.message ||
          'Authentication token missing from server response'
        );
      }
      const userData = {
        token: response.data.token,
        id: response.data.userId,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        roles: response.data.roles || ['User'] // default role is user
      };
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      /*
      // Decode token to check expiry (client-side check)
      const decoded = jwtDecode(token); // using 'jwt-decode' library
      const expiryDate = new Date(decoded.exp * 1000);
      console.log('Token expires at:', expiryDate); */
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      console.error('Login Error Details:', {
        error: error.message,
        response: error.response?.data
      });
      throw error; // Re-throw for component handling
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Fetch indicator data
  const fetchIndicatorData = useCallback(async () => {
    setLoading(true);
    setError(null); // Reset error state
    //console.log("Fetching indicator data...")
    try {
      const response = await apiClient.get('/indicator')
      // Validate response structure
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid data format from server');
      }
      const formattedIndicators = response.data.map(item => ({
        id: item.indicatorId,
        name: item.indicatorName,
        unit: item.unit,
        description: item.description || '',
        category: item.category
      }));
      //console.log('Logged indicator data: ', formattedIndicators);
      setIndicators(formattedIndicators);
      return formattedIndicators;
    } catch (error) {
      console.error('Indicator fetch failed', {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Regional Data
  const fetchRegionalData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/region')

      // Validate response structure
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid data format from server');
      }
      const formattedRegions = response.data.map(region => ({
        id: region.regionId,
        name: region.regionName,
        description: region.description || '',
        category: region.category
      }));
      setRegions(formattedRegions);
      return formattedRegions;
    } catch (error) {
      console.error('Regional data fetch failed:', {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Economic Data
  const fetchEconomicData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/data')

      // Validate response structure
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid data format from server');
      }
      const formattedData = response.data.map(dataPoint => ({
        id: dataPoint.DataId,
        value: dataPoint.value,
        dateTime: dataPoint.dateTime,
        indicatorId: dataPoint.indicatorId,
        regionId: dataPoint.regionId,
        sourceId: dataPoint.sourceId
      }));
      setEconomicData(formattedData);
      return formattedData;
    } catch (error) {
      console.error('Economic data fetch failed:', {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Source Data
  const fetchSourceData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/source')

      // Validate response structure
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid data format from server');
      }
      const formattedSources = response.data.map(source => ({
        id: source.sourceId,
        name: source.name,
        description: source.description || '',
        url: source.url
      }));
      setSources(formattedSources);
      return formattedSources;
    } catch (error) {
      console.error('Sources data fetch failed:', {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      login,
      logout,
      fetchIndicatorData,
      error,
      indicatorData,
      fetchRegionalData,
      regionalData,
      fetchEconomicData,
      economicData,
      fetchSourceData,
      sourceData,
      register
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  /*if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }*/
  return context;
}
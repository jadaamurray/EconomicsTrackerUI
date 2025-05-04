/* api, jwt decode, AppProvider
 set toke, userrole and userid
 use states
 set loading to true when beginning fetch data
 async behaviour to check background activityand reduce delays
 api.get is a restful method for http
 write set methods for the api endpoints to change the state like setIndicator
 response consts like favouriteRes
 logout
 favourites functions */


//Auth state
// token, user role, userid

//Add data state
// indicators, favourites, data, sources, regions, loading, error

//const isAuthenticated = !!token;

// Fetch initial data - this is the first consumption of api
//fetch indicators
//    const indicatorResponse = await VITE_API_BASE_URL.get('/indicator');
//fetch regions
//fetch econ data
//fetch data that may only work if authenticated like user data

//fetch favourites based on decoded userId - if you are adding favourties
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
  //const [economicData, setEconomicData] = useState([]);
  const [indicatorData, setIndicators] = useState([]);
  const [regionalData, setRegions] = useState([]);

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

  // Login function
  const login = async (formData) => {
    setLoading(true);
    try {
      //console.log('Making request to:', `${import.meta.env.VITE_API_BASE_URL}/Account/login`);
      const response = await apiClient.post('/Account/login', formData);
      // DEBUG
      /*console.group('[DEBUG] Response Inspection');
      console.log('Full response:', response);
      console.log('Status code:', response.status);
      console.log('Has .data?:', 'data' in response);
      console.log('Data type:', typeof response.data);
      console.log('Data keys:', response.data ? Object.keys(response.data) : 'null');
      console.groupEnd();*/
      //
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
      setUser(userData);
      setIsAuthenticated(true);
      // DEBUG
      /*console.group('User information');
      console.log('token: ', userData.token);
      console.log('id: ', userData.id);
      console.log('email: ', userData.email);
      console.log('roles: ', userData.roles);
      console.log('firstName: ', userData.firstName);
      console.log('lastName: ', userData.lastName);
      console.groupEnd();*/
      //
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
  const fetchIndicatorData = async () => {
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
  };

  // Fetch Regional Data
  const fetchRegionalData = async () => {
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
  };

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
      regionalData
    }}>
      {children}
    </AppContext.Provider>
  ); // add economicdata and fetch economic data to values in provider
}

export function useApp() {
  const context = useContext(AppContext);
  /*if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }*/
  return context;
}
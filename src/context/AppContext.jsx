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
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthService, apiClient } from '../apiconfig';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  //const [economicData, setEconomicData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Login function
  const login = async (formData) => {
    setLoading(true);
    try {
      console.log('Making request to:', `${import.meta.env.VITE_API_BASE_URL}/Account/login`);
      const response = await apiClient.post('/Account/login', formData);
      console.group('[DEBUG] Response Inspection');
      console.log('Full response:', response);
      console.log('Status code:', response.status);
      console.log('Has .data?:', 'data' in response);
      console.log('Data type:', typeof response.data);
      console.log('Data keys:', response.data ? Object.keys(response.data) : 'null');
      console.groupEnd();
      if (!response.data?.token) {
        throw new Error(response.data?.message ||
          'Authentication token missing from server response'
        );
      }

      const userData = {
        token: response.data.token,
        id: response.data.userId,
        email: response.data.email,
        roles: response.data.roles || ['User'] // default role is user
      };
      localStorage.setItem('authToken', response.data.token);
      //localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      console.group('User information');
      console.log('token: ', token);
      console.log('id: ', id);
      console.log('email: ', email);
      console.log('roles: ', roles);
      console.groupEnd();
      return { token: response.data.token, user: userData };
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
    setUser(null);
    navigate('/login');
  };
  /*
    // Fetch economic data
    const fetchEconomicData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/economic-data', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setEconomicData(data);
      } finally {
        setLoading(false);
      }
    };
  
    // Check auth status on app load
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(({ data }) => setUser(data))
          .catch(() => logout());
      }
    }, []);
  */
  return (
    <AppContext.Provider value={{
      user,
      loading,
      login,
      logout,
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
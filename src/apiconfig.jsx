import axios from 'axios';

console.log('Using API base URL:', import.meta.env.VITE_API_BASE_URL);

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(config => {
  console.log('Sending request to:', config.url);
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => { 
    console.log('Received response from:', response.config.url);
   return response;
  },
  (error) => { // Error handling
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export const AuthService = {
    login: (credentials) => apiClient.post('/Account/login', credentials),
    logout: () => apiClient.post('/Account/logout'),
    //getProfile: () => apiClient.get('/Account/profile'),
  };

  //put jwt token in token everytime going to fetch protected endpoint
  //check if token is valid by expiring after now
  //just creating axios connection
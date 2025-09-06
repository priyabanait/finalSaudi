import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Making API request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API response error:', error.response?.status, error.response?.data, error.config?.url);
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 400) {
        console.error('Bad Request:', data.message || 'Invalid request data');
      } else if (status === 401) {
        console.error('Unauthorized:', data.message || 'Authentication required');
      } else if (status === 404) {
        console.error('Not Found:', data.message || 'Resource not found');
      } else if (status === 500) {
        console.error('Server Error:', data.message || 'Internal server error');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Employee API functions
export const employeeAPI = {
  // Get employees by team
  getEmployeesByTeam: async (team) => {
    try {
      const response = await api.get(`/employee/team/${encodeURIComponent(team)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees by team:', error);
      throw error;
    }
  },

  // Get all employees
  getAllEmployees: async () => {
    try {
      const response = await api.get('/employee');
      return response.data;
    } catch (error) {
      console.error('Error fetching all employees:', error);
      throw error;
    }
  }
};

export default api;

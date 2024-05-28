import axios from 'axios';
const baseURL = process.env.REACT_APP_BASE_URL;
const axiosInstance = axios.create({
  baseURL: baseURL, // Your API base URL
  // timeout: 4000000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors for adding token to headers
axiosInstance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Interceptors for handling 401 response
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // if (error.response && error.response.status === 401) {
    //   localStorage.clear();
    //   window.location = "/";
    // }
    return Promise.reject(error);
  }
);
// Other interceptors...

export default axiosInstance;

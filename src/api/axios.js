import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;
const environment = process.env.REACT_APP_ENVIRONMENT;
console.log("kk",environment);
const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
  withCredentials:  environment === 'development' ? false : true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;



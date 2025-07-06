import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY_URL,
});

export default api;

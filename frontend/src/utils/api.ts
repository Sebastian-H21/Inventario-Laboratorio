import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pabellon.tecnm.mx/Inventario/backend/public/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
});
  export const setAuthToken = (token: string | null) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
    
  };

export default api;
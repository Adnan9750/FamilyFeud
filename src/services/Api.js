import axios from "axios";

const setupAPI = (token) => {
  const API = axios.create({
    baseURL: "https://family-feud-backend.onrender.com/api",
    // headers: { "ngrok-skip-browser-warning": "true" },
  });
  
  API.interceptors.request.use((req) => {
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });

  return API;
};

export default setupAPI;

// export const imageUrl = "https://gemapi.gemtrademanager.com/api";

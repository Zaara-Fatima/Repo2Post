import axios from "axios";

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};


export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});


api.interceptors.request.use((config) => {
    console.log("REQUEST:", config.url);
  console.log("TOKEN:", accessToken);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export const refreshAccessToken = async () => {
  const response = await api.post("/auth/refresh");
  return response.data.accessToken;
};
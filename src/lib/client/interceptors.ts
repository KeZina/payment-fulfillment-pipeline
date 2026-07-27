import { api } from "./axios";

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error?.response?.data || error.message);
  },
);

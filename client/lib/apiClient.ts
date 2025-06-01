import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.API_BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

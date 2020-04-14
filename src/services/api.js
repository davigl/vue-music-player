import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.0.9:1212"
});

export default api;

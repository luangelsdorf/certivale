import { apiURL } from "@/utils/env";
import axios from "axios";

const api = axios.create({
  baseURL: apiURL,
});

export default api;
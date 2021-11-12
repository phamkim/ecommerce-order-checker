import axios from "axios";
// const BASE_URI = "https://amz.cakeo.net/api/v1";
// const BASE_URI = "http://localhost:9000/api/v1";
const BASE_URI = "https://testamz.cakeo.net/api/v1";

const API = axios.create({
  baseURL: BASE_URI,
});

export { BASE_URI, API };

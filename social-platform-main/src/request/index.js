import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:9000/cor/smp",
  withCredentials: true,
});

export default instance;

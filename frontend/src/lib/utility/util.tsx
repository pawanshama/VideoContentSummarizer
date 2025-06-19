import axios from "axios";
const getInstance = axios.create({
   baseURL:'http://localhost:8001',
   timeout:3000,
   headers:{
      "Content-Type": "application/json",
      "Accept": "application/json"
   },
   withCredentials:true
});

export default getInstance;
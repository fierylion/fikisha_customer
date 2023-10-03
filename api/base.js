import axios from 'axios';
const dev = true
export const api = axios.create({
  baseURL: dev ? 'http://192.168.171.1:8000/' : 'https://fierylion.me/', //base url

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
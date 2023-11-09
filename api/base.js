import axios from 'axios';
const dev = true
export const apiWS = dev ? 'ws://192.168.21.1:8000/ws' : 'wss://fierylion.me/ws'
export const api = axios.create({
  baseURL: dev ? 'http://192.168.21.1:8000/' : 'https://fierylion.me/', //base url

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
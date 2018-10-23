import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.common['Authorization'] = localStorage.getItem('auth');

export const getRequest = (url) => {
  return axios.get(url).then((res) => {
    return res.data;
  });
}

export const postRequest = (url, params) => {
  return axios.post(url, params).then((res) => {
    return res.data;
  });
}

export const login = (params) => {
  return axios.post('login', params).then((res) => {
    localStorage.setItem('auth', res.headers.authorization);
    return res.data;
  });
}

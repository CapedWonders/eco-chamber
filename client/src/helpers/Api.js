import axios from 'axios';
import Auth from './Auth';

const baseURL = '/api';
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

const jwt = Auth.getJWT();

if (jwt) {
  headers['authorization'] = `bearer ${jwt}`;
}

const Api = {
  get: (url, params = {}) => {
    return axios.get(baseURL + url, { headers, params }).then(({ data }) => data);
  },
  post: (url, data = {}, params = {}) => {
    return axios.post(baseURL + url, data, { headers, params }).then(({ data }) => data);
  },
  delete: (url, params = {}) => {
    return axios.delete(baseURL + url, { headers, params }).then(({ data }) => data);
  },
};

export default Api;

/* eslint-disable */

import { showAlert } from './alert';

const { default: axios } = require('axios');

export async function login(email, password) {
  try {
    const res = await axios.post('http://localhost:3000/api/v1/users/login', {
      email,
      password,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}

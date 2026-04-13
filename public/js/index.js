/* eslint-disable */

import { login } from './login';
import { displayMap } from './mapbox';

// this will be the entry point for our JavaScript code
// Index.js is about getting data from user interface and delegating actions for other modules for example (get data from login form and call the login functionality)
// dom elements
const form = document.querySelector('form.form');
const map = document.getElementById('map');

if (map) {
  const locations = JSON.parse(map.dataset.locations);
  displayMap(locations);
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    await login(email, password);
  });
}

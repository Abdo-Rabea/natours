/* eslint-disable */

import { login } from './login';
import { logout } from './logout';
import { displayMap } from './mapbox';
import { updateUserData, updateUserPassword } from './updateSettings';

// this will be the entry point for our JavaScript code
// Index.js is about getting data from user interface and delegating actions for other modules for example (get data from login form and call the login functionality)
// dom elements
const form = document.querySelector('form.form.form--login');
const map = document.getElementById('map');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
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

if (logOutBtn) {
  logOutBtn.addEventListener('click', async () => {
    await logout();
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const photo = document.getElementById('photo').files[0];
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (photo) {
      formData.append('photo', photo);
    }
    await updateUserData(formData);
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const savePasswordBtn = document.querySelector('.btn--save-password');
    const currentPasswordEl = document.getElementById('password-current');
    const passwordEl = document.getElementById('password');
    const confirmPasswordEl = document.getElementById('password-confirm');

    const currentPassword = currentPasswordEl.value;
    const password = passwordEl.value;
    const confirmPassword = confirmPasswordEl.value;

    savePasswordBtn.textContent = 'Updating...';
    savePasswordBtn.disabled = true;

    await updateUserPassword({
      currentPassword,
      password,
      confirmPassword,
    });

    savePasswordBtn.textContent = 'save password';
    savePasswordBtn.disabled = false;

    currentPasswordEl.value = '';
    passwordEl.value = '';
    confirmPasswordEl.value = '';
  });
}

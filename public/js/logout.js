import axios from 'axios';
import { showAlert } from './alert';

export async function logout() {
  try {
    await axios.get('http://localhost:3000/api/v1/users/logout');
    location.reload(true);
  } catch (err) {
    console.error(err);
    showAlert('error', 'Error logging out! Try again.');
  }
}

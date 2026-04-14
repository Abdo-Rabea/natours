import axios from 'axios';
import { showAlert } from './alert';

export async function updateUserData(name, email) {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:3000/api/v1/users/update-me',
      data: {
        name,
        email,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Data updated successfully!');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
}
export async function updateUserPassword(data) {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:3000/api/v1/users/update-password',
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password updated successfully!');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
}

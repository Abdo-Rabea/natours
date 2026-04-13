/* eslint-disable */

function hideAlert() {
  const alertEl = document.querySelector('.alert');
  if (alertEl) alertEl.remove();
}

export function showAlert(type, msg) {
  hideAlert();

  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(() => {
    hideAlert();
  }, 5000);
}

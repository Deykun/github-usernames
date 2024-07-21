export const getAppStatus = () => {
  const {
    text: statusText = '',
  } = window.U2N.ui.status;

  if (!statusText) {
    return '';
  }

  return `<span class="u2u-nav-status">${IconNewUser} <span>${statusText}</span></span>`;
};

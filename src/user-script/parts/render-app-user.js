export const getAppUser = ({ isActive = false }) => {
  const isProfilPage = Boolean(document.querySelector('.page-profile'));

  if (!isProfilPage) {
    return '';
  }

  return `<div class="u2u-nav-button-wrapper">
      ${!isActive
    ? `<button class="u2u-nav-button" data-content="user">${IconUser}</button>`
    : `<button class="u2u-nav-button u2u-nav-button--active" data-content="">${IconUser}</button>
    <div class="u2u-nav-button-content">
      <div>
        Edit user
      </div>
      </div>`}
    </div>`;
};

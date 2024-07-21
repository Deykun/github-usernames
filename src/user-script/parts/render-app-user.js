export const getAppUser = ({ isActive = false }) => {
  const isProfilPage = Boolean(document.querySelector('.page-profile'));
  const username = location.pathname.replace('/', '');

  const shouldRender = Boolean(isProfilPage && username);
  if (!shouldRender) {
    return '';
  }

  const displayName = getDisplayNameByUsername(username);

  return `<div class="u2u-nav-button-wrapper">
      ${!isActive
    ? `<button class="u2u-nav-button" data-content="user">${IconUser}</button>`
    : `<button class="u2u-nav-button u2u-nav-button--active" data-content="">${IconUser}</button>
      <div class="u2u-nav-button-content">
        <div>
          Edit user
        </div>
        <input type="text" placeholder="${displayName}" />
      </div>`}
    </div>`;
};

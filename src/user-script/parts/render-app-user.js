export const getAppUser = ({ isActive = false }) => {
  const isProfilPage = Boolean(document.querySelector('.page-profile'));
  const username = location.pathname.replace('/', '');

  const shouldRender = Boolean(isProfilPage && username);
  if (!shouldRender) {
    return '';
  }

  const displayName = getDisplayNameByUsername(username);

  return `<div class="u2n-nav-button-wrapper">
      ${!isActive
    ? `<button class="u2n-nav-button" data-content="user">${IconUser}</button>`
    : `<button class="u2n-nav-button u2n-nav-button--active" data-content="">${IconUser}</button>
      <div class="u2n-nav-popup">
        <div class="u2n-nav-popup-content">
          <h2 class="u2n-nav-popup-title">${IconUser} <span>Edit user label</span></h2>
          ${getTextInput({
    placeholder: displayName,
    idButton: 'user-save-name',
    idInput: 'user-value-name',
  })}
        </div>
      </div>`}
    </div>`;
};

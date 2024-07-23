export const getAppUser = ({ isActive = false }) => {
  const isProfilPage = Boolean(document.querySelector('.page-profile'));
  const username = location.pathname.replace('/', '');

  const shouldRender = Boolean(isProfilPage && username);
  if (!shouldRender) {
    return '';
  }

  const user = window.U2N.usersByUsernames?.[username] || {};
  const displayName = getDisplayNameByUsername(username);

  return `<div class="u2n-nav-button-wrapper">
      ${!isActive
    ? `<button class="u2n-nav-button" data-content="user">${IconUser}</button>`
    : `<button class="u2n-nav-button u2n-nav-button--active" data-content="">${IconUser}</button>
      <div class="u2n-nav-popup">
        <div class="u2n-nav-popup-content">
          <h2 class="u2n-nav-popup-title">${IconUser} <span>User</span></h2>
          <ul>
            <li>
              ID: <strong>${user.id}</strong>
            </li>
            <li>
              Username: <strong>${user.username}</strong>
            </li>
            <li>
              Name: <strong>${user.name}</strong>
            </li>
          </ul>
          <br />
          ${getTextInput({
    label: 'Edit display name',
    placeholder: displayName,
    value: displayName,
    idButton: 'user-save-name',
    idInput: 'user-value-name',
  })}
        </div>
      </div>`}
    </div>`;
};

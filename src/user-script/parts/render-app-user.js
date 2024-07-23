appendCSS(`
  .u2n-nav-user-preview {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 20px;
    font-size: 10px;
  }
`, { sourceName: 'render-app-user' });

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
          <div class="u2n-nav-user-preview">
            <strong data-hovercard-url="/users/${user.username}/fake">${user.username}</strong>
          </div>
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
    name: username,
    idButton: 'user-save-name',
    idInput: 'user-value-name',
    isDisabled: getShouldUseUsernameAsDisplayname(username),
  })}
        ${getShouldUseUsernameAsDisplayname(username)
    ? '<small class="u2n-nav-popup-footer">This user is excluded by a string in the Settings tab.</small>'
    : ''}
        </div>
      </div>`}
    </div>`;
};

window.U2N.ui.eventsSubscribers.displayNameUpdate = {
  selector: '#user-save-name',
  handleClick: () => {
    const inputElement = document.getElementById('user-value-name');
    const username = inputElement.getAttribute('name');
    const displayName = inputElement.value;

    saveDisplayNameForUsername(username, displayName);
  },
};

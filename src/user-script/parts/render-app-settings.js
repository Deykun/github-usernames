appendCSS(`
  .u2u-nav-popup-button {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    padding: 8px 4px;
    border-radius: 3px;
    font-size: 14px;
    letter-spacing: 0.04em;
    text-decoration: none;
    background: none;
    border: none;
    color: var(--bgColor-default);
    background-color: var(--fgColor-success);
  }

  .u2u-nav-popup-button:hover {
    text-decoration: none;
  }

  .u2u-nav-popup-button svg {
    fill: currentColor;
    width: 26px;
    height: 26px;
  }

  .u2u-nav-popup-button--github {
    color: var(--u2u-nav-item-bg);
    background-color: var(--u2u-nav-item-text-strong);
  }

  .u2u-nav-popup-button--danger {
    color: var(--fgColor-danger);
    background-color: transparent;
    border: 1px solid var(--fgColor-danger);
  }
`, { sourceName: 'render-app-settings' });

export const getAppSettings = ({ isActive = false }) => {
  const totalSavedUsers = Object.values(window.U2N.usersByUsernames).length;
  return `<div class="u2u-nav-button-wrapper">
      ${!isActive
    ? `<button class="u2u-nav-button" data-content="settings">${IconCog}</button>`
    : `<button class="u2u-nav-button u2u-nav-button--active" data-content="">${IconCog}</button>
      <div class="u2u-nav-popup">
        <div class="u2u-nav-popup-content">
          <h2 class="u2u-nav-popup-title">${IconCog} <span>Settings</span></h2>
          <div>
            Users saved: <strong>${totalSavedUsers}</strong>
          </div>
          ${totalSavedUsers === 0 ? '' : `<button id="u2u-remove-all-users" class="u2u-nav-popup-button u2u-nav-popup-button--danger">
            ${IconRemoveUsers} <span>remove all saved users</span>
          </button>`}
          <br />
          <div>
            You can learn more or report an issue here:
          </div>
          <a class="u2u-nav-popup-button u2u-nav-popup-button--github" href="https://github.com/Deykun/github-usernames" target="_blank">
            ${IconGithub} <span>deykun / github-usernames</span>
          </a>
        </div>
      </div>`}
    </div>`;
};

window.U2N.ui.eventsSubscribers.removeAllUsers = {
  selector: '#u2u-remove-all-users',
  handleClick: resetUsers,
};

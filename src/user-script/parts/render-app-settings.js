appendCSS(`
  .u2u-nav-popup-button.u2u-nav-popup-button--github {
    color: var(--u2u-nav-item-bg);
    background-color: var(--u2u-nav-item-text-strong);
  }

  .u2u-nav-remove-all {
    color: var(--fgColor-danger);
    background: transparent;
    border: none;
    borer-bottom: 1px solid var(--fgColor-danger);
    padding: 0;
    font-size: 12px;
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
            ${totalSavedUsers === 0 ? '' : `<button id="u2u-remove-all-users" class="u2u-nav-remove-all">
              remove all
            </button>`}
          </div>
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

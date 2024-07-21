appendCSS(`
  .u2u-nav-github-link {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    padding: 10px 4px;
    background-color: black;
    color: white;
    border-radius: 3px;
    font-size: 13px;
    letter-spacing: 0.08em;
    text-decoration: none;
  }

  .u2u-nav-github-link:hover {
    text-decoration: none;
  }

  .u2u-nav-github-link svg {
    fill: currentColor;
    width: 16px;
    height: 16px;
  }
`, { sourceName: 'render-app-settings' });

export const getAppSettings = ({ isActive = false }) => {
  return `<div class="u2u-nav-button-wrapper">
      ${!isActive
    ? `<button class="u2u-nav-button" data-content="settings">${IconCog}</button>`
    : `<button class="u2u-nav-button u2u-nav-button--active" data-content="">${IconCog}</button>
      <div class="u2u-nav-popup">
        <div class="u2u-nav-popup-content">
          <h2 class="u2u-nav-popup-title">${IconCog} <span>Settings</span></h2>
          <p>
            Users saved: <strong>${Object.values(window.U2N.usersByUsernames).length}</strong>
          </p>
          <p>
            You can report an issue or learn more here:
          </p>
          <a class="u2u-nav-github-link" href="https://github.com/Deykun/github-usernames" target="_blank">
            ${IconGithub}
            <span>deykun/github-usernames</span>
          </a>
        </div>
      </div>`}
    </div>`;
};

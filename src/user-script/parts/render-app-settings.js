export const getAppSettings = ({ isActive = false }) => {
  return `<div class="u2u-nav-button-wrapper">
      ${!isActive
    ? `<button class="u2u-nav-button" data-content="settings">${IconCog}</button>`
    : `<button class="u2u-nav-button u2u-nav-button--active" data-content="">${IconCog}</button>
    <div class="u2u-nav-button-content">
      <div>
        <p>
          You can report an issue here: <a href="https://github.com/Deykun/github-usernames-to-names" target="_blank">github.com/Deykun/github-usernames-to-names</a>
        </p>
      </div>
      </div>`}
    </div>`;
};

appendCSS(`
  .u2n-nav-popup-button.u2n-nav-popup-button--github {
    color: var(--u2n-nav-item-bg);
    background-color: var(--u2n-nav-item-text-strong);
  }

  .u2n-nav-remove-all {
    color: var(--fgColor-danger);
    background: transparent;
    border: none;
    borer-bottom: 1px solid var(--fgColor-danger);
    padding: 0;
    font-size: 12px;
  }

  .u2n-nav-popup-footer {
    margin-top: -10px;
    font-size: 10px;
    color: var(--u2n-nav-item-text);
    text-align: right;
  }
`, { sourceName: 'render-app-settings' });

export const getAppSettings = ({ isActive = false }) => {
  const { settings } = window.U2N;
  const totalSavedUsers = Object.values(window.U2N.usersByUsernames).length;

  return `<div class="u2n-nav-button-wrapper">
      ${!isActive
    ? `<button class="u2n-nav-button" data-content="settings">${IconCog}</button>`
    : `<button class="u2n-nav-button u2n-nav-button--active" data-content="">${IconCog}</button>
      <div class="u2n-nav-popup">
        <div class="u2n-nav-popup-content">
          <h2 class="u2n-nav-popup-title">${IconCog} <span>Settings</span></h2>
          <div>
            Users saved: <strong>${totalSavedUsers}</strong>
            ${totalSavedUsers === 0 ? '' : `<button id="u2n-remove-all-users" class="u2n-nav-remove-all">
              remove all
            </button>`}
          </div>
          <br />
          ${getCheckbox({
    idInput: 'settings-should-use-substring',
    label: 'only use names from profiles when their username contains the specified string <span style="opacity: 0.5;">(use a comma for multiple)</span>',
    isChecked: settings.shouldFilterBySubstring,
  })}
          ${getTextInput({
    label: 'Edit substring',
    placeholder: 'ex. company_',
    idButton: 'settings-save-substring',
    idInput: 'settings-value-substring',
    value: settings.filterSubstring,
  })}
          <br />
          <div>
            You can learn more or report an issue here:
          </div>
          <a class="u2n-nav-popup-button u2n-nav-popup-button--github" href="https://github.com/Deykun/github-usernames" target="_blank">
            ${IconGithub} <span>deykun / github-usernames</span>
          </a>
          <small class="u2n-nav-popup-footer">Version ${window.U2N.version}</small>
        </div>
      </div>`}
    </div>`;
};

window.U2N.ui.eventsSubscribers.removeAllUsers = {
  selector: '#u2n-remove-all-users',
  handleClick: resetUsers,
};

window.U2N.ui.eventsSubscribers.shouldFilterBySubstring = {
  selector: '#settings-should-use-substring',
  handleClick: (_, calledByElement) => {
    saveSetting('shouldFilterBySubstring', calledByElement.checked);
  },
};

window.U2N.ui.eventsSubscribers.filterSubstring = {
  selector: '#settings-save-substring',
  handleClick: () => {
    const value = document.getElementById('settings-value-substring')?.value || '';

    saveSetting('filterSubstring', value);
  },
};

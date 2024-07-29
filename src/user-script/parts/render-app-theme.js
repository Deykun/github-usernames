const themeSettings = {
  colors: [{
    label: 'Light',
    value: 'light',
  },
  {
    label: 'Dark',
    value: 'dark',
  },
  {
    label: 'Sky',
    value: 'sky',
  },
  {
    label: 'Grass',
    value: 'grass',
  }],
  names: [
    {
      label: 'Dwight Schrute',
      value: 'name-surname',
    },
    {
      label: 'Dwight S.',
      value: 'name-s',
    },
    {
      label: 'Dwight',
      value: 'name',
    },
    {
      label: 'D. Schrute',
      value: 'n-surname',
    },
    {
      label: 'DSchrute911 <span style="opacity: 0.5;">(github\'s default)</span>',
      value: 'username',
    }],
};

appendCSS(`
  .u2u-names-list li:last-child {
    grid-column: 1 / 3;
  }
`, { sourceName: 'render-app-theme' });

export const getAppTheme = ({ isActive = false }) => {
  const { settings } = window.U2N;

  return `<div class="u2n-nav-button-wrapper">
      ${!isActive
    ? `<button class="u2n-nav-button" data-content="theme">${IconThemes}</button>`
    : `<button class="u2n-nav-button u2n-nav-button--active" data-content="">${IconThemes}</button>
      <div class="u2n-nav-popup">
        <div class="u2n-nav-popup-content">
          <h2 class="u2n-nav-popup-title">${IconThemes} <span>Theme</span></h2>
          <div>
            <h3>Color</h3>
            <ul class="grid-2">
              ${themeSettings.colors.map(({ label, value }) => `<li>
  ${getRadiobox({
    name: 'color',
    classNameInput: 'u2n-theme-color',
    label,
    value,
    isChecked: settings.color === value,
  })}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h3>Display name</h3>
            <ul class="grid-2 u2u-names-list">
            ${themeSettings.names.map(({ label, value }, index) => `<li>
  ${getRadiobox({
    name: 'names',
    classNameInput: 'u2n-theme-name',
    label,
    value,
    isChecked: settings.name === value,
  })}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h3>Other</h3>       
  ${getCheckbox({
    idInput: 'settings-should-show-username-when-better',
    label: 'should show the username when it fits better',
    isChecked: settings.shouldShowUsernameWhenBetter,
  })}
  ${getCheckbox({
    idInput: 'settings-should-show-avatar',
    label: 'should show avatars',
    isChecked: settings.shouldShowAvatars,
  })}
          </div>
        </div>
      </div>`}
    </div>`;
};

window.U2N.ui.eventsSubscribers.color = {
  selector: '.u2n-theme-color',
  handleClick: (_, calledByElement) => {
    saveSetting('color', calledByElement.value);
  },
};

window.U2N.ui.eventsSubscribers.name = {
  selector: '.u2n-theme-name',
  handleClick: (_, calledByElement) => {
    saveSetting('name', calledByElement.value);
  },
};

window.U2N.ui.eventsSubscribers.shouldShowAvatars = {
  selector: '#settings-should-show-avatar',
  handleClick: (_, calledByElement) => {
    saveSetting('shouldShowAvatars', calledByElement.checked);
  },
};

window.U2N.ui.eventsSubscribers.shouldShowUsernameWhenBetter = {
  selector: '#settings-should-show-username-when-better',
  handleClick: (_, calledByElement) => {
    saveSetting('shouldShowUsernameWhenBetter', calledByElement.checked);
  },
};

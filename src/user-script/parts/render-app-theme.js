const themeSettings = {
  colors: [{
    label: 'Light',
    value: 'light',
  },
  {
    label: 'Dark',
    value: 'dark',
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
    }],
};

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
    idInput: `theme-color-${value}`,
    label,
    value,
    isChecked: settings.color === value,
  })}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h3>Display name</h3>
            <ul class="grid-2">
            ${themeSettings.names.map(({ label, value }) => `<li>
            ${getRadiobox({
    name: 'names',
    idInput: `theme-names-${value}`,
    label,
    value,
    isChecked: settings.name === value,
  })}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h3>Other</h3>
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

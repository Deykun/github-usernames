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
  return `<div class="u2n-nav-button-wrapper">
      ${!isActive
    ? `<button class="u2n-nav-button" data-content="theme">${IconThemes}</button>`
    : `<button class="u2n-nav-button u2n-nav-button--active" data-content="">${IconThemes}</button>
      <div class="u2n-nav-popup">
        <div class="u2n-nav-popup-content">
          <h2 class="u2n-nav-popup-title">${IconThemes} <span>Theme</span></h2>
          <div>
            <h4>Colors</h4>
            <ul>
              ${themeSettings.colors.map(({ label, value }) => `<li>
              ${getRadiobox({
    name: 'color',
    id: `theme-color-${value}`,
    label,
    value,
  })}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h4>Names</h4>
            <ul>
            ${themeSettings.names.map(({ label, value }) => `<li>
            ${getRadiobox({
    name: 'names',
    id: `theme-names-${value}`,
    label,
    value,
  })}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h4>Other</h4>
            ${getCheckbox({
    id: 'settings-should-show-avatar',
    label: 'should show avatars',
  })}
          </div>
        </div>
      </div>`}
    </div>`;
};

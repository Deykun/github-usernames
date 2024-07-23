appendCSS(`
.u2n-text-input-wrapper {
  display: flex;
  gap: 5px;
}

.u2n-text-input-wrapper input {
  width: 100%;
  padding-left: 10px;
}
`, { sourceName: 'interface-text-input' });

const getTextInput = ({ idInput, idButton, placeholder }) => {
  return `<div class="u2n-text-input-wrapper">
    <input id="${idInput}" type="text" placeholder="${placeholder}" />
    <button id="${idButton}" class="u2n-nav-popup-button" title="Save">
      ${IconSave}
    </button>
  </div>`;
};

appendCSS(`
.u2n-checkbox-wrapper {
  display: flex;
  gap: 5px;
}

.u2n-checkbox-wrapper input {
  margin-left: 5px;
  margin-right: 5px;
}
`, { sourceName: 'interface-value' });

const getCheckbox = ({ idInput, label }) => {
  return `<label class="u2n-checkbox-wrapper">
    <span><input type="checkbox" id="${idInput}" /></span>
    <span>${label}</span>
  </label>`;
};

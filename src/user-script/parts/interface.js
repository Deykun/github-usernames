appendCSS(`
.u2n-text-input-wrapper {
  display: flex;
  gap: 5px;
  position: relative;
}

.u2n-text-input-wrapper input {
  width: 100%;
  padding-left: 10px;
}

.u2n-text-input-wrapper label {
  position: absolute;
  top: 0;
  left: 5px;
  transform: translateY(-50%);
  background-color: var(--u2n-nav-item-bg);
  padding: 0 5px;
  font-size: 10px;
}
`, { sourceName: 'interface-text-input' });

const getTextInput = ({ idInput, idButton, label, placeholder }) => {
  return `<div class="u2n-text-input-wrapper">
    <input id="${idInput}" type="text" placeholder="${placeholder}" />
    ${label ? `<label>${label}</label>` : ''}
    <button id="${idButton}" class="u2n-nav-popup-button" title="Save">
      ${IconSave}
    </button>
  </div>`;
};

appendCSS(`
.u2n-checkbox-wrapper {
  display: flex;
  gap: 5px;
  font-weight: 400;
}

.u2n-checkbox-wrapper input {
  margin-left: 5px;
  margin-right: 5px;
}
`, { sourceName: 'interface-value' });

const getCheckbox = ({
  idInput, label, name, value, type = 'checkbox',
}) => {
  return `<label class="u2n-checkbox-wrapper">
    <span><input type="${type}" id="${idInput}" name="${name}" ${value ? `value="${value}"` : ''} /></span>
    <span>${label}</span>
  </label>`;
};

const getRadiobox = (params) => {
  return getCheckbox({ ...params, type: 'radio' });
};

// ==UserScript==
// @namespace       deykun
// @name            Usernames to names - GitHub
// @description     Replace ambiguous usernames with actual names from user profiles.
// @author          deykun
// @version         0.9.0
// @include         https://github.com*
// @grant           none
// @run-at          document-start
// @updateURL       https://raw.githubusercontent.com/Deykun/github-usernames/main/github-usernames.user-srcipt.js
// @downloadURL     https://raw.githubusercontent.com/Deykun/github-usernames/main/github-usernames.user-srcipt.js
// ==/UserScript==

'use strict';

const getFromLocalStorage = (key, defaultValues = {}) => (localStorage.getItem(key)
  ? { ...defaultValues, ...JSON.parse(localStorage.getItem(key)) }
  : { ...defaultValues });

const defaultSettings = {
  color: 'light',
  name: 'name-s',
  shouldShowAvatars: true,
  shouldFilterBySubstring: false,
  filterSubstring: '',
};

const getSettingsFromLS = () => getFromLocalStorage('u2n-settings', defaultSettings);
const getUsersByUsernamesFromLS = () => getFromLocalStorage('u2n-users');
const getCustomNamesByUsernamesFromLS = () => getFromLocalStorage('u2n-users-names');

window.U2N = {
  version: '0.9.0',
  isDevMode: true,
  cache: {
    HTML: {},
    CSS: {},
    inited: false,
    status: null,
    location: location.href,
  },
  settings: getSettingsFromLS(),
  usersByUsernames: getUsersByUsernamesFromLS(),
  customNamesByUsernames: getCustomNamesByUsernamesFromLS(),
  actions: {},
};

window.U2N.ui = {
  status: {
    type: '',
    text: '',
  },
  openedContent: '',
  eventsSubscribers: {},
};


const userScriptLogger = (params) => {
  if (params.isError) {
    const { isCritical = false, message = '', error } = params;

    if (isCritical) {
      // eslint-disable-next-line no-console
      console.error('A User2Names error (from Tampermonkey) has occurred. You can ignore it, or describe the error and create an issue here: https://github.com/Deykun/github-usernames/issues');
      // eslint-disable-next-line no-console
      console.error(`U2N error: ${message}`);
      // eslint-disable-next-line no-console
      console.error(error);
    }

    if (window.U2N.isDevMode && error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
};

const domReady = (fn) => {
  document.addEventListener('DOMContentLoaded', fn);
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    fn();
  }
};

const initU2N = async () => {
  if (window.U2N.cache.inited) {
    return;
  }

  window.U2N.cache.inited = true;

  try {
    const updateStatus = ({ type = '', text = '', durationInSeconds = 4 }) => {
  if (window.U2N.cache.status) {
    clearTimeout(window.U2N.cache.status);
  }

  window.U2N.ui.status = {
    type,
    text,
  };

  renderStatus();

  window.U2N.cache.status = setTimeout(() => {
    window.U2N.ui.status = {
      type: '',
      text: '',
    };

    renderStatus();
  }, durationInSeconds * 1000);
};

const saveNewUsers = (usersByNumber = {}, params = {}) => {
  const oldUserByUsernames = getUsersByUsernamesFromLS();

  const newUserByUsernames = Object.entries(usersByNumber).reduce((stack, [username, value]) => {
    const isValidUsername = username && !username.includes(' ');
    if (isValidUsername) {
      stack[username] = value;
    }

    return stack;
  }, JSON.parse(JSON.stringify(oldUserByUsernames)));

  const didChange = JSON.stringify(oldUserByUsernames) !== JSON.stringify(newUserByUsernames);

  if (!didChange) {
    return false;
  }

  window.U2N.usersByUsernames = newUserByUsernames;
  localStorage.setItem('u2n-users', JSON.stringify(window.U2N.usersByUsernames));

  renderUsers();
  updateStatus({
    type: 'users-update',
    text: params.customStatusText || "The users' data were updated.",
  });

  if (window.U2N.ui.openedContent === 'settings') {
    renderApp();
  }

  return true;
};

const saveNewUser = (newUser) => {
  if (newUser.username) {
    const wasUpdated = JSON.stringify(window.U2N.usersByUsernames?.[newUser.username])
    !== JSON.stringify(newUser);

    if (wasUpdated) {
      return saveNewUsers({
        [newUser.username]: newUser,
      }, { customStatusText: `<strong>${newUser.username}</strong>'s data was updated.` });
    }
  }

  return false;
};

const saveDisplayNameForUsername = (username, name) => {
  if (!username) {
    return false;
  }

  const customNamesByUsernames = getCustomNamesByUsernamesFromLS();

  if (name) {
    customNamesByUsernames[username] = name;
  } else {
    delete customNamesByUsernames[username];
  }

  window.U2N.customNamesByUsernames = customNamesByUsernames;

  localStorage.setItem('u2n-users-names', JSON.stringify(customNamesByUsernames));

  renderUsers();
  updateStatus({
    type: 'users-update',
    text: `<strong>${username}</strong>'s display name was updated.`,
  });

  return true;
};

const saveSetting = (settingName, value, params) => {
  const acceptedSettingsNames = Object.keys(defaultSettings);
  if (!acceptedSettingsNames.includes(settingName)) {
    return false;
  }

  const settings = getSettingsFromLS();

  settings[settingName] = value;

  window.U2N.settings = settings;
  localStorage.setItem('u2n-settings', JSON.stringify(settings));

  renderApp();
  renderUsers();
  updateStatus({
    type: 'settings-update',
    text: params?.customStatusText || 'A setting was updated.',
  });

  return true;
};

const resetUsers = () => {
  localStorage.removeItem('u2n-users');
  localStorage.removeItem('u2n-users-names');
  window.U2N.usersByUsernames = {};
  window.U2N.customNamesByUsernames = {};
  renderUsers();
  renderApp();
  updateStatus({
    type: 'users-reset',
    text: "The users' data were removed.",
  });
};

    const appendCSS = (styles, { sourceName = '' } = {}) => {
  const appendOnceSelector = sourceName ? `g-u2n-css-${sourceName}`.trim() : undefined;
  if (appendOnceSelector) {
    /* Already appended */
    if (document.getElementById(appendOnceSelector)) {
      return;
    }
  }

  const style = document.createElement('style');
  if (sourceName) {
    style.setAttribute('id', appendOnceSelector);
  }

  style.innerHTML = styles;
  document.head.append(style);
};

// eslint-disable-next-line default-param-last
const render = (HTML = '', source) => {
  const id = `g-u2n-html-${source}`;

  if (HTML === window.U2N.cache.HTML[id]) {
    /* Don't rerenderOnContentChange if HTML is the same */
    return;
  }

  window.U2N.cache.HTML[id] = HTML;

  const wrapperEl = document.getElementById(id);

  if (!HTML) {
    if (wrapperEl) {
      wrapperEl.remove();
    }

    return;
  }

  if (wrapperEl) {
    wrapperEl.innerHTML = HTML;

    return;
  }

  const el = document.createElement('div');
  el.id = id;
  el.setAttribute('data-testid', id);
  el.innerHTML = HTML;

  document.body.appendChild(el);
};

const nestedSelectors = (selectors, subcontents) => {
  return subcontents.map(([subselector, content]) => {
    return `${selectors.map((selector) => `${selector} ${subselector}`).join(', ')} {
      ${content}
    }`;
  }).join(' ');
};

    const debounce = (fn, time) => {
  let timeoutHandler;

  return (...args) => {
    clearTimeout(timeoutHandler);
    timeoutHandler = setTimeout(() => {
      fn(...args);
    }, time);
  };
};

const upperCaseFirstLetter = (text) => (typeof text === 'string' ? text.charAt(0).toUpperCase() + text.slice(1) : '');

const getShouldUseUsernameAsDisplayname = (username) => {
  const {
    shouldFilterBySubstring,
    filterSubstring,
  } = window.U2N.settings;

  if (!shouldFilterBySubstring) {
    return false;
  }

  const lowerCasedUsername = username?.toLowerCase();

  const hasAtleastOneSubstringIncludedInUsername = filterSubstring.replaceAll(' ', '').split(',').some(
    (substring) => lowerCasedUsername.includes(substring.toLowerCase()),
  );

  return !hasAtleastOneSubstringIncludedInUsername;
};

const getDisplayNameByUsername = (username) => {
  if (getShouldUseUsernameAsDisplayname(username)) {
    return username;
  }

  const user = window.U2N.usersByUsernames?.[username];
  const customDisplayName = window.U2N.customNamesByUsernames?.[username];

  if (customDisplayName) {
    return customDisplayName;
  }

  if (!user?.name) {
    return username;
  }

  const {
    name,
  } = window.U2N.settings;

  const subnames = user.name.toLowerCase().split(' ').filter(Boolean).map((subname) => upperCaseFirstLetter(subname));

  if (name === 'name-surname') {
    return subnames.join(' ');
  }

  const [firstName, ...restOfNames] = subnames;

  if (name === 'name-s') {
    return [firstName, ...restOfNames.map((subname) => `${subname.at(0)}.`)].join(' ');
  }

  if (name === 'name') {
    return firstName;
  }

  const [lastName, ...firstNamesReversed] = subnames.reverse();
  const firstNames = firstNamesReversed.reverse();

  // n-surname
  return [firstNames.map((subname) => `${subname.at(0)}.`), lastName].join(' ');
};

    /*
  https://iconmonstr.com
*/

const IconCog = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<path d="M24 14.187V9.813c-2.148-.766-2.726-.802-3.027-1.529-.303-.729.083-1.169 1.059-3.223l-3.093-3.093c-2.026.963-2.488 1.364-3.224 1.059-.727-.302-.768-.889-1.527-3.027H9.813c-.764 2.144-.8 2.725-1.529 3.027-.752.313-1.203-.1-3.223-1.059L1.968 5.061c.977 2.055 1.362 2.493 1.059 3.224-.302.727-.881.764-3.027 1.528v4.375c2.139.76 2.725.8 3.027 1.528.304.734-.081 1.167-1.059 3.223l3.093 3.093c1.999-.95 2.47-1.373 3.223-1.059.728.302.764.88 1.529 3.027h4.374c.758-2.131.799-2.723 1.537-3.031.745-.308 1.186.099 3.215 1.062l3.093-3.093c-.975-2.05-1.362-2.492-1.059-3.223.3-.726.88-.763 3.027-1.528zm-4.875.764c-.577 1.394-.068 2.458.488 3.578l-1.084 1.084c-1.093-.543-2.161-1.076-3.573-.49-1.396.581-1.79 1.693-2.188 2.877h-1.534c-.398-1.185-.791-2.297-2.183-2.875-1.419-.588-2.507-.045-3.579.488l-1.083-1.084c.557-1.118 1.066-2.18.487-3.58-.579-1.391-1.691-1.784-2.876-2.182v-1.533c1.185-.398 2.297-.791 2.875-2.184.578-1.394.068-2.459-.488-3.579l1.084-1.084c1.082.538 2.162 1.077 3.58.488 1.392-.577 1.785-1.69 2.183-2.875h1.534c.398 1.185.792 2.297 2.184 2.875 1.419.588 2.506.045 3.579-.488l1.084 1.084c-.556 1.121-1.065 2.187-.488 3.58.577 1.391 1.689 1.784 2.875 2.183v1.534c-1.188.398-2.302.791-2.877 2.183zM12 9c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.238-5 5s2.238 5 5 5 5-2.238 5-5-2.238-5-5-5z"/>
</svg>`;
const IconGithub = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
</svg>`;
const IconNewUser = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<path d="M9.602 3.7c-1.154 1.937-.635 5.227 1.424 9.025.93 1.712.697 3.02.338 3.815-.982 2.178-3.675 2.799-6.525 3.456C2.875 20.45 3 20.866 3 24H1.005L1 22.759c0-2.52.199-3.975 3.178-4.663 3.365-.777 6.688-1.473 5.09-4.418C4.535 4.949 7.918 0 13 0c3.321 0 5.97 2.117 5.97 6.167 0 3.555-1.949 6.833-2.383 7.833h-2.115c.392-1.536 2.499-4.366 2.499-7.842 0-5.153-5.867-4.985-7.369-2.458zM23 19h-3v-3h-2v3h-3v2h3v3h2v-3h3v-2z"/>
</svg>`;
const IconSave = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<path d="M14 3h2.997v5H14V3zm9 1v20H1V0h17.997L23 4zM6 9h12V2H6v7zm14 4H4v9h16v-9z"/>
</svg>`;
const IconThemes = `<svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 24 24">
<path d="M10.5 24h-7C2.1 24 1 22.86 1 21.5V9.86c-.662-.473-1-1.201-1-1.941 0-.376.089-.75.289-1.129 1.065-1.898 2.153-3.783 3.265-5.654C4.016.399 4.765 0 5.599 0c.635 0 .972.204 1.445.479.662.386 9 5.352 12.512 7.441.087.052 3.366 1.988 3.449 2.045.663.49.995 1.197.995 1.934 0 .375-.092.745-.295 1.13-1.064 1.899-2.153 3.784-3.265 5.655-.577.92-1.615 1.29-2.496 1.088-.392.234-5.826 3.75-6.252 3.968-.413.212-.762.26-1.192.26M3 13.237V21.5c0 .274.221.5.5.5h4.588C6.368 19.094 4.671 16.173 3 13.237m1.606-1.238c.053.092 5.681 9.797 5.726 9.859.108.139.299.181.455.098.164-.092 5.081-3.251 5.081-3.251-.639-.377-8.144-4.851-11.262-6.706m.659-9.829C4.352 3.626 2.066 7.695 2.03 7.78c-.07.171-.008.366.149.464.201.12 16.023 9.547 16.177 9.571.151.022.297-.045.377-.174.942-1.584 3.206-5.55 3.232-5.601.069-.172.007-.367-.15-.465-.201-.12-15.983-9.499-16.09-9.546-.18-.074-.365-.002-.46.141m1.557 2.695c1.104 0 2 .897 2 2 0 1.104-.896 2-2 2s-2-.896-2-2c0-1.103.896-2 2-2"/>
</svg>`;
const IconWrench = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<path d="M24 20.283c0 .934-.355 1.869-1.07 2.599-.705.721-1.649 1.118-2.658 1.118-.993 0-1.927-.387-2.629-1.089l-1.842-1.842c.241-.972.252-1.839.088-2.736l3.166 3.166c.655.656 1.8.649 2.447-.013.326-.333.501-.774.49-1.241-.01-.444-.188-.864-.504-1.179l-8.858-8.858c-.813-.812-1.23-1.938-1.143-3.087.107-1.391-.395-2.752-1.379-3.737-.758-.76-1.731-1.23-2.785-1.354l2.163 2.163c.23 1.065.137 2.147-.93 3.468-1.105 1.371-2.59 2.222-4.373 1.833L2.021 7.332c.125 1.039.59 2.023 1.352 2.786 1.521 1.521 3.038 1.368 4.039 1.368 1.037 0 2.052.421 2.785 1.154l.471.471c-1.302-.236-2.538-.079-3.655.385-1.881.075-3.713-.625-5.053-1.966C.441 10.01 0 8.248 0 6.724c0-1.649.518-3.018.743-3.496l4.39 4.389c.558-.044 1.328-.54 1.869-1.21.355-.44.576-.909.605-1.267L3.219.75C4.209.328 5.561 0 6.757 0c1.802 0 3.493.699 4.765 1.969 1.396 1.399 2.111 3.332 1.959 5.304-.044.565.161 1.12.562 1.521l8.859 8.859c.732.733 1.098 1.681 1.098 2.63zm-2.842-.033c0-.507-.409-.916-.916-.916s-.917.41-.917.917.41.917.917.917c.507 0 .916-.411.916-.918zM9.5 15C7.015 15 5 17.015 5 19.5S7.015 24 9.5 24s4.5-2.015 4.5-4.5S11.985 15 9.5 15zm-.469 6.484-1.688-1.637.696-.697.991.94 2.116-2.169.696.696-2.811 2.867z"/>
</svg>`;
const IconUser = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<path d="M20.822 18.096c-3.439-.794-6.641-1.49-5.09-4.418C20.451 4.766 16.983 0 12 0 6.918 0 3.535 4.949 8.268 13.678c1.598 2.945-1.725 3.641-5.09 4.418C.199 18.784 0 20.239 0 22.759L.005 24H2c0-3.134-.125-3.55 1.838-4.003 2.851-.657 5.543-1.278 6.525-3.456.359-.795.592-2.103-.338-3.815C7.967 8.927 7.447 5.637 8.602 3.7c1.354-2.275 5.426-2.264 6.767-.034 1.15 1.911.639 5.219-1.403 9.076-.91 1.719-.671 3.023-.31 3.814.99 2.167 3.707 2.794 6.584 3.458C22.119 20.45 22 20.896 22 24h1.995L24 22.759c0-2.52-.199-3.975-3.178-4.663z"/>
</svg>`;
const IconRemoveUsers = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<path d="M23 18h-5v-1h5v1zM7.002 8c-2.494 0-4.227 2.383-1.867 6.839.775 1.464-.826 1.812-2.545 2.209C1.099 17.393 1 18.122 1 19.385l.002.615h1.33c0-1.918-.186-1.385 1.824-1.973 1.014-.295 1.91-.723 2.316-1.612.211-.463.355-1.22-.162-2.197-.953-1.798-1.219-3.374-.713-4.215.547-.909 2.27-.908 2.82.015C9.352 11.585 7.623 14 7.396 15h1.396C9.234 14 10 12.792 10 11.1 10 9.09 8.688 8 7.002 8zm7.754-1.556c.895-1.487 3.609-1.494 4.512.022.77 1.291.422 3.484-.949 6.017-.098.18-.17.351-.232.517h1.463c3.057-5.744.816-9-2.547-9-3.324 0-5.635 3.177-2.488 9.119 1.033 1.952-1.102 2.416-3.395 2.946-1.986.459-2.118 1.429-2.118 3.111l.003.825h1.33c0-2.069-.08-2.367 1.174-2.657 1.918-.442 3.729-.86 4.389-2.305.242-.527.402-1.397-.205-2.543-1.363-2.573-1.705-4.778-.937-6.052z"/>
</svg>`;

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
  padding: 2px 5px;
  border-radius: 2px;
  font-size: 9px;
}
`, { sourceName: 'interface-text-input' });

const getTextInput = ({
  idInput, idButton, label, name, value = '', placeholder, isDisabled = false,
}) => {
  return `<div class="u2n-text-input-wrapper">
    <input
      ${idInput ? ` id="${idInput}" ` : ''}
      type="text"
      ${name ? ` name="${name}" ` : ''}
      value="${value}"
      placeholder="${placeholder}"
      ${isDisabled ? ' disabled ' : ''}
    />
    ${label ? `<label>${label}</label>` : ''}
    <button id="${idButton}" class="u2n-nav-popup-button" title="Save">
      ${IconSave}
    </button>
  </div>`;
};

appendCSS(`
.u2n-checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 400;
}

.u2n-checkbox-wrapper input {
  margin-left: 5px;
  margin-right: 5px;
}
`, { sourceName: 'interface-value' });

const getCheckbox = ({
  idInput, classNameInput, label, name, value, isChecked = false, type = 'checkbox',
}) => {
  return `<label class="u2n-checkbox-wrapper">
    <span>
      <input
        type="${type}"
        ${idInput ? ` id="${idInput}" ` : ''}
        ${classNameInput ? ` class="${classNameInput}" ` : ''}
        name="${name}"
        ${value ? `value="${value}"` : ''}
        ${isChecked ? ' checked' : ''}
      />
    </span>
    <span>${label}</span>
  </label>`;
};

const getRadiobox = (params) => {
  return getCheckbox({ ...params, type: 'radio' });
};

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

const getAppSettings = ({ isActive = false }) => {
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
    label: 'only use names from profiles when their username contains the specified string (use a comma for multiple)',
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

    /* import @/render-app-status.js */
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
    }],
};

const getAppTheme = ({ isActive = false }) => {
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
            <ul class="grid-2">
            ${themeSettings.names.map(({ label, value }) => `<li>
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

    appendCSS(`
  .u2n-nav-user-preview {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 20px;
    font-size: 10px;
  }
`, { sourceName: 'render-app-user' });

const getAppUser = ({ isActive = false }) => {
  const isProfilPage = Boolean(document.querySelector('.page-profile'));
  const username = location.pathname.replace('/', '');

  const shouldRender = Boolean(isProfilPage && username);
  if (!shouldRender) {
    return '';
  }

  const user = window.U2N.usersByUsernames?.[username] || {};
  const displayName = getDisplayNameByUsername(username);

  return `<div class="u2n-nav-button-wrapper">
      ${!isActive
    ? `<button class="u2n-nav-button" data-content="user">${IconUser}</button>`
    : `<button class="u2n-nav-button u2n-nav-button--active" data-content="">${IconUser}</button>
      <div class="u2n-nav-popup">
        <div class="u2n-nav-popup-content">
          <h2 class="u2n-nav-popup-title">${IconUser} <span>User</span></h2>
          <div class="u2n-nav-user-preview">
            <strong data-hovercard-url="/users/${user.username}/fake">${user.username}</strong>
          </div>
          <ul>
            <li>
              ID: <strong>${user.id}</strong>
            </li>
            <li>
              Username: <strong>${user.username}</strong>
            </li>
            <li>
              Name: <strong>${user.name}</strong>
            </li>
          </ul>
          <br />
          ${getTextInput({
    label: 'Edit display name',
    placeholder: displayName,
    value: displayName,
    name: username,
    idButton: 'user-save-name',
    idInput: 'user-value-name',
    isDisabled: getShouldUseUsernameAsDisplayname(username),
  })}
        ${getShouldUseUsernameAsDisplayname(username)
    ? '<small class="u2n-nav-popup-footer">This user is excluded by a string in the Settings tab.</small>'
    : ''}
        </div>
      </div>`}
    </div>`;
};

window.U2N.ui.eventsSubscribers.displayNameUpdate = {
  selector: '#user-save-name',
  handleClick: () => {
    const inputElement = document.getElementById('user-value-name');
    const username = inputElement.getAttribute('name');
    const displayName = inputElement.value;

    saveDisplayNameForUsername(username, displayName);
  },
};

    appendCSS(`
  :root {
    --u2n-nav-item-size: 35px;
    --u2n-nav-item-bg: var(--bgColor-muted);
    --u2n-nav-item-bg: var(--bgColor-default);
    --u2n-nav-item-text-strong: var(--fgColor-default);
    --u2n-nav-item-text: var(--fgColor-muted);
    --u2n-nav-item-text-hover: var(--fgColor-accent);
    --u2n-nav-item-border: var(--borderColor-muted);
    --u2n-nav-item-radius: 5px;
  }

  .u2n-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    right: 30px;
    height: var(--u2n-nav-item-size);
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.08));
  }

  .u2n-nav > * + * {
    margin-left: -1px;
  }

  .u2n-nav > :first-child {
    border-top-left-radius: var(--u2n-nav-item-radius);
  }

  .u2n-nav > :last-child {
    border-top-right-radius: var(--u2n-nav-item-radius);
  }

  .u2n-nav-status,
  .u2n-nav-button-wrapper {
    height: var(--u2n-nav-item-size);
    min-width: var(--u2n-nav-item-size);
    line-height: var(--u2n-nav-item-size);
    border: 1px solid var(--u2n-nav-item-border);
    border-bottom-width: 0px;
    background: var(--u2n-nav-item-bg);
  }

  .u2n-nav-button-wrapper {
    position: relative;
  }

  .u2n-nav-button {
    background: transparent;
    border: none;
    padding: 0;
    color: var(--u2n-nav-item-text);
    width: var(--u2n-nav-item-size);
    transition: 0.3s ease-in-out;
  }

  .u2n-nav-button:hover {
    color: var(--u2n-nav-item-text-hover);
  }

  .u2n-nav-button--active {
    color: var(--u2n-nav-item-text-strong);
  }

  .u2n-nav-button svg {
    fill: currentColor;
    padding: 25%;
    height: var(--u2n-nav-item-size);
    width: var(--u2n-nav-item-size);
    line-height: var(--u2n-nav-item-size);
  }

  .u2n-nav-popup {
    position: absolute;
    right: 0;
    bottom: calc(100% + 10px);
    width: 300px;
    color: var(--u2n-nav-item-text-strong);
    border: 1px solid var(--u2n-nav-item-border);
    border-radius: var(--u2n-nav-item-radius);
    border-bottom-right-radius: 0;
    background-color: var(--u2n-nav-item-bg);
  }

  .u2n-nav-popup-content {
    display: flex;
    flex-flow: column;
    gap: 18px;
    max-height: calc(100vh - 60px);
    overflow: auto;
    padding: 10px;
    padding-top: 0;
    font-size: 12px;
    line-height: 1.3;
    text-align: left;
  }

  .u2n-nav-popup-title {
    position: sticky;
    top: 0px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-top: 10px;
    padding-bottom: 5px;
    font-size: 16px;
    background-color: var(--u2n-nav-item-bg);
  }

  .u2n-nav-popup-title svg {
    fill: currentColor;
    height: 16px;
    width: 16px;
  }

  .u2n-nav-popup h3 {
    font-size: 13px;
    margin-bottom: 8px;
  }

  .u2n-nav-popup ul {
    display: flex;
    flex-flow: column;
    gap: 8px;
    list-style: none;
  }

  .u2n-nav-popup .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .u2n-nav-popup::after {
    content: '';
    position: absolute;
    bottom: -10px;
    right: calc((var(--u2n-nav-item-size) / 2) - 5px);
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-top-color: var(--u2n-nav-item-border);
  }

  .u2n-nav-popup-button {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    padding: 8px;
    border-radius: 3px;
    font-size: 14px;
    letter-spacing: 0.04em;
    text-decoration: none;
    background: none;
    border: none;
    color: var(--bgColor-default);
    background-color: var(--fgColor-success);
  }

  .u2n-nav-popup-button:hover {
    text-decoration: none;
  }

  .u2n-nav-popup-button svg {
    fill: currentColor;
    width: 18px;
    height: 18px;
  }
`, { sourceName: 'render-app' });

const renderApp = () => {
  const content = window.U2N.ui.openedContent;

  render(`<aside class="u2n-nav" data-active="${content}">
    ${getAppUser({ isActive: content === 'user' })}
    ${getAppTheme({ isActive: content === 'theme' })}
    ${getAppSettings({ isActive: content === 'settings' })}
  </aside>`, 'u2n-app');
};

window.U2N.ui.eventsSubscribers.content = {
  selector: '.u2n-nav-button',
  handleClick: (_, calledByElement) => {
    if (calledByElement) {
      const content = calledByElement.getAttribute('data-content');
      const isClose = !content || content === window.U2N.ui.openedContent;

      if (isClose) {
        window.U2N.ui.openedContent = '';
      } else {
        window.U2N.ui.openedContent = content;
      }
    }

    renderApp();
  },
};

    appendCSS(`
  .u2n-nav-status {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 50%;
    height: var(--u2n-nav-item-size);
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.08));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 0 10px;
    margin-right: 10px;
    border-top-left-radius: var(--u2n-nav-item-radius);
    border-top-right-radius: var(--u2n-nav-item-radius);
    color: var(--fgColor-default);
    font-size: 12px;
    transform: translateY(60px) translateX(-50%);
    animation: U2NSlideInFromTop 0.4s cubic-bezier(0.1, 0.7, 1, 0.1) forwards;
  }

  @keyframes U2NSlideInFromTop {
    0% {
      transform: translateY(60px) translateX(-50%);
    }
    100% {
      transform: translateY(0) translateX(-50%);
    }
  }

  .u2n-nav-status svg {
    fill: currentColor;
    color: var(--fgColor-success);
    height: 14px;
    width: 14px;
  }

  .u2n-nav-status--danger svg {
    color: var(--fgColor-danger);
  }
`, { sourceName: 'render-app-status' });

const StatusIconByType = {
  'users-update': IconNewUser,
  'users-reset': IconRemoveUsers,
  'settings-update': IconWrench,
};

const renderStatus = () => {
  const {
    type,
    text: statusText = '',
  } = window.U2N.ui.status;

  if (!statusText) {
    render('', 'u2n-status');

    return;
  }

  const Icon = StatusIconByType[type] || '';
  const isNegative = ['users-reset'].includes(type);

  render(`<span class="u2n-nav-status ${isNegative ? 'u2n-nav-status--danger' : ''}">
  ${Icon} <span>${statusText}</span>
</span>`, 'u2n-status');
};

    const getUserElements = () => {
  const links = Array.from(document.querySelectorAll('[data-hovercard-url^="/users/"]')).map((el) => {
    const username = el.getAttribute('data-hovercard-url').match(/users\/([A-Za-z0-9_-]+)\//)[1];

    if (username && el.textContent.includes(username)) {
      return {
        el,
        username,
      };
    }

    return undefined;
  }).filter(Boolean);

  return links;
};

appendCSS(` 
  :root {
    --u2n-user-text: #00293e;
    --u2n-user-bg: #f2f2f2;
    --u2n-user-text--hover: #0054ae;
    --u2n-user-bg--hover: #dbedff;
  }

  body[data-u2n-color="dark"] {
    --u2n-user-text: white;
    --u2n-user-bg: #26292e;
    --u2n-user-text--hover: #dbedff;
    --u2n-user-bg--hover: #142a42;
  }

  body[data-u2n-color="sky"] {
    --u2n-user-text: #03113c;
    --u2n-user-bg: #def3fa;
    --u2n-user-text--hover: #000;
    --u2n-user-bg--hover: #beedfc;
  }

  body[data-u2n-color="grass"] {
    --u2n-user-text: #fff;
    --u2n-user-bg: #163b13;
    --u2n-user-text--hover: #b8ffb3;
    --u2n-user-bg--hover: #30582d;
  }

  [data-u2n-cache-user] {
    display: inline-block;
    font-size: 0;
  }

  .u2n-tag {
    align-self: center;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-left: 3px;
    padding: 0 6px;
    border-radius: 4px;
    font-size: 12px;
    letter-spacing: 0.05em;
    font-weight: 600;
    font-style: normal;
    text-decoration: none !important;
    line-height: 19px;
    height: 18px;
    white-space: nowrap;
    color: var(--u2n-user-text) !important;
    background-color: var(--u2n-user-bg) !important;
    transition: 0.15s ease-in-out; 
    position: relative;
  }

  .u2n-tag svg {
    display: inline-block;
    vertical-align: middle;
    fill: currentColor;
    height: 10px;
    width: 10px;
  }

  .u2n-tag img {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 4px;
    height: 100%;
    aspect-ratio: 1 / 1;
  }

  .u2n-tag:hover {
    color: var(--u2n-user-text--hover) !important;
    background-color: var(--u2n-user-bg--hover) !important;
  }

  /* We hide them and show them only in verified locations */
  .u2n-tag-avatar {
    display: none;
  }

  ${nestedSelectors([
    '.gh-header', // pr header on pr site
    '.u2n-nav-user-preview', // preview in user tab
    '[data-issue-and-pr-hovercards-enabled] [id*="issue_"]', // prs in repo
    '[data-issue-and-pr-hovercards-enabled] [id*="check_"]', // actions in repo
    '.timeline-comment-header', // comments headers
    '.comment-body', // comments body
  ], [
    ['.u2n-tag-avatar', 'display: inline-block;'],
    ['.u2n-tag-avatar + *', 'margin-left: 1.5em;'],
  ])}
`, { sourceName: 'render-users' });

const renderUsers = () => {
  const elements = getUserElements();
  const {
    color,
    shouldShowAvatars,
  } = window.U2N.settings;

  const shouldUpdateTheme = document.body.getAttribute('data-u2n-color') !== color;
  if (shouldUpdateTheme) {
    document.body.setAttribute('data-u2n-color', color);
  }

  elements.forEach(({ el, username }) => {
    const user = window.U2N.usersByUsernames?.[username];
    const displayName = getDisplayNameByUsername(username);

    const cacheValue = `${displayName}${user ? '+u' : '-u'}${shouldShowAvatars ? '+a' : '-a'}`;

    const isAlreadySet = el.getAttribute('data-u2n-cache-user') === cacheValue;
    if (isAlreadySet) {
      return;
    }

    el.setAttribute('data-u2n-cache-user', cacheValue);

    el.querySelector('.u2n-tags-holder')?.remove();

    const tagsHolderEl = document.createElement('span');

    let holderClassNames = 'u2n-tags-holder u2n-tags--user';
    if (!user) {
      holderClassNames += ' u2n-tags--no-data';
    }

    tagsHolderEl.setAttribute('class', holderClassNames);

    const tagEl = document.createElement('span');
    tagEl.setAttribute('class', 'u2n-tag');

    const avatarSrc = user?.avatarSrc || '';

    tagEl.innerHTML = `${shouldShowAvatars && avatarSrc ? `<img src="${user?.avatarSrc}" class="u2n-tag-avatar" />` : ''}<span>${displayName}</span>`;

    tagsHolderEl.append(tagEl);

    el.append(tagsHolderEl);
  });
};

    const rerenderOnContentChange = () => {
  renderUsers();
};

const rerenderOnLocationChange = () => {
  renderApp();
};

    const getUserFromUserPageIfPossible = () => {
  const elProfile = document.querySelector('.page-profile .js-profile-editable-replace');

  if (elProfile) {
    try {
      const avatarEl = elProfile.querySelector('.avatar-user');
      const avatarSrc = avatarEl?.getAttribute('src')?.split('?')[0] || '';
      const id = avatarSrc ? avatarSrc.match(/u\/([0-9]+)?/)[1] : '';
      const username = elProfile.querySelector('.vcard-username')?.textContent?.trim() || '';
      const name = elProfile.querySelector('.vcard-fullname')?.textContent?.trim() || '';

      return {
        id,
        username,
        avatarSrc,
        name,
      };
    } catch (error) {
      userScriptLogger({
        isError: true, message: 'getUserFromUserPageIfPossible() failed while parsing the profile', error,
      });
    }
  }

  return undefined;
};

const getUserFromHovercardIfPossible = () => {
  const elHovercard = document.querySelector('.user-hovercard-avatar');

  if (elHovercard) {
    try {
      const avatarEl = elHovercard.querySelector('.avatar-user');
      const avatarSrc = avatarEl?.getAttribute('src')?.split('?')[0] || '';
      const id = avatarSrc ? avatarSrc.match(/u\/([0-9]+)?/)[1] : '';
      const username = avatarEl?.getAttribute('alt')?.replace('@', '').trim();
      const name = elHovercard.parentNode.parentNode.querySelector(`.Link--secondary[href="/${username}"]`)?.textContent?.trim() || '';

      return {
        id,
        username,
        avatarSrc,
        name,
      };
    } catch (error) {
      userScriptLogger({
        isError: true, message: 'getUserFromHovercardIfPossible() failed while parsing the card', error,
      });
    }
  }

  return undefined;
};

const getUsersFromPeopleListIfPossible = () => {
  if (!location.pathname.includes('/people')) {
    return [];
  }

  try {
    const usersEls = Array.from(document.querySelectorAll('li[data-bulk-actions-id]'));

    const users = usersEls.map((el) => {
      const avatarEl = el.querySelector('.avatar-user');
      const avatarSrc = avatarEl?.getAttribute('src')?.split('?')[0] || '';
      const id = avatarSrc ? avatarSrc.match(/u\/([0-9]+)?/)[1] : '';
      const username = avatarEl?.getAttribute('alt')?.replace('@', '').trim();
      const name = Array.from(
        el.querySelector('[data-test-selector="linked-name-is-full-if-exists"]').childNodes,
      ).find((child) => child.nodeType === Node.TEXT_NODE).textContent.trim();

      return {
        id,
        username,
        avatarSrc,
        name,
      };
    });

    return users;
  } catch (error) {
    userScriptLogger({
      isError: true, message: 'getUsersFromPeopleListIfPossible() failed while parsing the people list', error,
    });
  }

  return [];
};

const saveNewUsersIfPossible = () => {
  const userFromProfile = getUserFromUserPageIfPossible();
  if (userFromProfile) {
    saveNewUser(userFromProfile);
  }

  const userFromHoverCard = getUserFromHovercardIfPossible();
  if (userFromHoverCard) {
    saveNewUser(userFromHoverCard);
  }

  const usersFromPeopleList = getUsersFromPeopleListIfPossible();
  if (usersFromPeopleList.length > 0) {
    saveNewUsers(usersFromPeopleList.reduce((stack, user) => {
      stack[user.username] = user;

      return stack;
    }, {}), { customStatusText: `<strong>${usersFromPeopleList.length} users'</strong> data were updated` });
  }
};


    saveNewUsersIfPossible();
    renderUsers();
    renderStatus();
    renderApp();

    try {
  document.body.addEventListener('click', (event) => {
    const handlerData = Object.values(window.U2N.ui.eventsSubscribers).find(({ selector }) => {
      /* It checks max 4 nodes, while .closest() would look for all the nodes to body */
      const matchedHandlerData = [
        event.target,
        event.target?.parentElement,
        event.target?.parentElement?.parentElement,
        event.target?.parentElement?.parentElement?.parentElement,
      ].filter(Boolean).find((el) => el.matches(selector));

      return Boolean(matchedHandlerData);
    });

    if (handlerData) {
      const { selector, handleClick, shouldPreventDefault = true } = handlerData;

      if (shouldPreventDefault) {
        event.preventDefault();
      }

      const calledByElement = event.target.closest(selector);

      handleClick(event, calledByElement);
    }
  });
} catch (error) {
  userScriptLogger({
    isError: true, isCritical: true, message: 'Click detect failed', error,
  });
}


    const debouncedRefresh = debounce(() => {
      saveNewUsersIfPossible();
      renderUsers();

      const didLocationChange = location.href !== window.U2N.cache.location;
      if (didLocationChange) {
        window.U2N.cache.location = location.href;

        rerenderOnLocationChange();
      }
    }, 500);

    const observer = new MutationObserver(debouncedRefresh);
    const config = {
      childList: true,
      subtree: true,
    };
    observer.observe(document.body, config);
  } catch (error) {
    userScriptLogger({
      isError: true, isCritical: true, message: 'initU2N() failed', error,
    });

    throw error;
  }
};

domReady(initU2N);

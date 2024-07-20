// ==UserScript==
// @namespace       deykun
// @name            Usernames to names - GitHub
// @description     Replace ambiguous usernames with actual names from user profiles.
// @author          deykun
// @version         0.9
// @include         https://*github.com*
// @grant           none
// @run-at          document-start
// @updateURL       https://raw.githubusercontent.com/Deykun/github-usernames-to-names/main/github-usernames-to-names.user-srcipt.js
// @downloadURL     https://raw.githubusercontent.com/Deykun/github-usernames-to-names/main/github-usernames-to-names.user-srcipt.js
// ==/UserScript==

'use strict';

window.U2N = {
  version: 0.9,
  isDevMode: true,
  cache: {
    HTML: {},
    CSS: {},
    status: null,
  },
  status: {
    type: '',
    text: '',
  },
  usersByUsernames: localStorage.getItem('u2n-users') ? JSON.parse(localStorage.getItem('u2n-users')) : {},
  actions: {},
};


const userScriptLogger = (params) => {
  if (params.isError) {
    const { isCritical = false, message = '', error } = params;

    if (isCritical) {
      // eslint-disable-next-line no-console
      console.error('A User2Names error (from Tampermonkey) has occurred. You can ignore it, or describe the error and create an issue here: https://github.com/Deykun/github-usernames-to-names/issues');
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
  try {
    const updateStatus = ({ type = '', text = '' }) => {
  if (window.U2N.cache.status) {
    clearTimeout(window.U2N.cache.status);
  }

  window.U2N.status = {
    type,
    text,
  };

  renderApp();

  window.U2N.cache.status = setTimeout(() => {
    window.U2N.status = {
      type: '',
      text: '',
    };

    renderApp();
  }, 2000);
};

const saveNewUsers = (usersByNumber = {}, params = {}) => {
  const oldUserByUsernames = localStorage.getItem('u2n-users')
    ? JSON.parse(localStorage.getItem('u2n-users'))
    : {};

  const newUserByUsernames = Object.entries(usersByNumber).reduce((stack, [username, value]) => {
    stack[username] = value;

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
    type: 'default',
    text: params.customStatusText || 'New users data was added',
  });

  return true;
};

const saveNewUser = (newUser) => {
  if (newUser.username) {
    const wasUpdated = JSON.stringify(window.U2N.usersByUsernames?.[newUser.username])
    !== JSON.stringify(newUser);

    if (wasUpdated) {
      return saveNewUsers({
        [newUser.username]: newUser,
      }, { customStatusText: `<strong>${newUser.username}</strong>'s data was added` });
    }
  }

  return false;
};

const resetUsers = () => {
  localStorage.removeItem('u2n-users');
  window.U2N.usersByUsernames = {};
  renderUsers();
};

window.U2N.actions.resetUsers = resetUsers;

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
    /* Don't rerender if HTML is the same */
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

    /*
  https://iconmonstr.com
*/

const IconThemes = `<svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 24 24">
<path d="M10.5 24h-7C2.1 24 1 22.86 1 21.5V9.86c-.662-.473-1-1.201-1-1.941 0-.376.089-.75.289-1.129 1.065-1.898 2.153-3.783 3.265-5.654C4.016.399 4.765 0 5.599 0c.635 0 .972.204 1.445.479.662.386 9 5.352 12.512 7.441.087.052 3.366 1.988 3.449 2.045.663.49.995 1.197.995 1.934 0 .375-.092.745-.295 1.13-1.064 1.899-2.153 3.784-3.265 5.655-.577.92-1.615 1.29-2.496 1.088-.392.234-5.826 3.75-6.252 3.968-.413.212-.762.26-1.192.26M3 13.237V21.5c0 .274.221.5.5.5h4.588C6.368 19.094 4.671 16.173 3 13.237m1.606-1.238c.053.092 5.681 9.797 5.726 9.859.108.139.299.181.455.098.164-.092 5.081-3.251 5.081-3.251-.639-.377-8.144-4.851-11.262-6.706m.659-9.829C4.352 3.626 2.066 7.695 2.03 7.78c-.07.171-.008.366.149.464.201.12 16.023 9.547 16.177 9.571.151.022.297-.045.377-.174.942-1.584 3.206-5.55 3.232-5.601.069-.172.007-.367-.15-.465-.201-.12-15.983-9.499-16.09-9.546-.18-.074-.365-.002-.46.141m1.557 2.695c1.104 0 2 .897 2 2 0 1.104-.896 2-2 2s-2-.896-2-2c0-1.103.896-2 2-2"/>
</svg>`;
const IconNewUser = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<path d="M9.602 3.7c-1.154 1.937-.635 5.227 1.424 9.025.93 1.712.697 3.02.338 3.815-.982 2.178-3.675 2.799-6.525 3.456C2.875 20.45 3 20.866 3 24H1.005L1 22.759c0-2.52.199-3.975 3.178-4.663 3.365-.777 6.688-1.473 5.09-4.418C4.535 4.949 7.918 0 13 0c3.321 0 5.97 2.117 5.97 6.167 0 3.555-1.949 6.833-2.383 7.833h-2.115c.392-1.536 2.499-4.366 2.499-7.842 0-5.153-5.867-4.985-7.369-2.458zM23 19h-3v-3h-2v3h-3v2h3v3h2v-3h3v-2z"/>
</svg>
`;
const IconCog = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<path d="M24 14.187V9.813c-2.148-.766-2.726-.802-3.027-1.529-.303-.729.083-1.169 1.059-3.223l-3.093-3.093c-2.026.963-2.488 1.364-3.224 1.059-.727-.302-.768-.889-1.527-3.027H9.813c-.764 2.144-.8 2.725-1.529 3.027-.752.313-1.203-.1-3.223-1.059L1.968 5.061c.977 2.055 1.362 2.493 1.059 3.224-.302.727-.881.764-3.027 1.528v4.375c2.139.76 2.725.8 3.027 1.528.304.734-.081 1.167-1.059 3.223l3.093 3.093c1.999-.95 2.47-1.373 3.223-1.059.728.302.764.88 1.529 3.027h4.374c.758-2.131.799-2.723 1.537-3.031.745-.308 1.186.099 3.215 1.062l3.093-3.093c-.975-2.05-1.362-2.492-1.059-3.223.3-.726.88-.763 3.027-1.528zm-4.875.764c-.577 1.394-.068 2.458.488 3.578l-1.084 1.084c-1.093-.543-2.161-1.076-3.573-.49-1.396.581-1.79 1.693-2.188 2.877h-1.534c-.398-1.185-.791-2.297-2.183-2.875-1.419-.588-2.507-.045-3.579.488l-1.083-1.084c.557-1.118 1.066-2.18.487-3.58-.579-1.391-1.691-1.784-2.876-2.182v-1.533c1.185-.398 2.297-.791 2.875-2.184.578-1.394.068-2.459-.488-3.579l1.084-1.084c1.082.538 2.162 1.077 3.58.488 1.392-.577 1.785-1.69 2.183-2.875h1.534c.398 1.185.792 2.297 2.184 2.875 1.419.588 2.506.045 3.579-.488l1.084 1.084c-.556 1.121-1.065 2.187-.488 3.58.577 1.391 1.689 1.784 2.875 2.183v1.534c-1.188.398-2.302.791-2.877 2.183zM12 9c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.238-5 5s2.238 5 5 5 5-2.238 5-5-2.238-5-5-5z"/>
</svg>`;

    appendCSS(`
  :root {
    --u2u-nav-item-size: 35px;
    --u2u-nav-item-bg: var(--bgColor-muted);
    --u2u-nav-item-text: var(--fgColor-muted);
    --u2u-nav-item-text-hover: var(--fgColor-accent);
    --u2u-nav-item-border: var(--borderColor-muted);
  }

  .u2u-nav {
    position: fixed;
    bottom: 0;
    right: 30px;
    height: var(--u2u-nav-item-size);
    display: flex;
  }

  .u2u-nav > * + * {
    margin-left: -1px;
  }

  .u2u-nav > :first-child {
    border-top-left-radius: 5px;
  }

  .u2u-nav > :last-child {
    border-top-right-radius: 5px;
  }

  .u2u-nav-status,
  .u2u-nav-button {
    height: var(--u2u-nav-item-size);
    min-width: var(--u2u-nav-item-size);
    line-height: var(--u2u-nav-item-size);
    border: 1px solid var(--u2u-nav-item-border);
    border-bottom-width: 0px;
    background: var(--u2u-nav-item-bg);
  }

  .u2u-nav-status {
    color: var(--fgColor-default);
    font-size: 12px;
    padding: 0 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  .u2u-nav-status svg {
    fill: currentColor;
    color: var(--fgColor-success);
    height: 14px;
    width: 14px;
  }

  .u2u-nav-button {
    padding: 0;
    color: var(--u2u-nav-item-text);
    width: var(--u2u-nav-item-size);
  }

  .u2u-nav-button:hover {
    color: var(--u2u-nav-item-text-hover);
  }

  .u2u-nav-button svg {
    fill: currentColor;
    padding: 25%;
    height: var(--u2u-nav-item-size);
    width: var(--u2u-nav-item-size);
    line-height: var(--u2u-nav-item-size);
  }
`, { sourceName: 'render-app' });

const renderApp = () => {
  const {
    text: statusText = '',
  } = window.U2N.status;

  render(`<aside class="u2u-nav">
    ${!statusText ? '' : `<span class="u2u-nav-status">${IconNewUser} <span>${statusText}</span></span>`}
    <button class="u2u-nav-button">${IconThemes}</button>
    <button class="u2u-nav-button">${IconCog}</button>
  </aside>`, 'u2u-app');
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
  [data-u2n-display-name] {
    font-size: 0;
  }

  .u2n-tag {
    display: inline-block;
    align-self: center;
    content: attr(data-u2n-display-name);
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
    color: #00293e;
    background-color: #f2f2f2;
    transition: 0.15s ease-in-out; 
    position: relative;
  }

  .u2n-tag img {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    aspect-ratio: 1 / 1;
  }

  .u2n-tag img + * {
    margin-left: 1.5em;
  }

  .u2n-tag:hover {
    color: #0054ae !important;
    background: #dbedff !important;
  }

`, { sourceName: 'render-users' });

const renderUsers = () => {
  const elements = getUserElements();

  elements.forEach(({ el, username }) => {
    const user = window.U2N.usersByUsernames?.[username];

    let displayName = user ? user?.username : `? ${username}`;
    if (user?.name) {
      const [firstName, ...rest] = user.name.toLowerCase().split(' ');

      displayName = `${upperCaseFirstLetter(firstName)} ${rest.map((nextName) => `${nextName.at(0).toUpperCase()}.`).join(' ')}`;
    }

    const isAlreadySet = el.getAttribute('data-u2n-display-name') === displayName;

    if (isAlreadySet) {
      return;
    }

    el.querySelector('.u2n-tags-holder')?.remove();
    el.setAttribute('data-u2n-display-name', displayName);

    const tagsHolderEl = document.createElement('span');

    let holderClassNames = 'u2n-tags-holder u2n-tags--user';
    if (!user) {
      holderClassNames += ' u2n-tags--no-data';
    }

    tagsHolderEl.setAttribute('class', holderClassNames);

    const tagEl = document.createElement('span');
    tagEl.setAttribute('class', 'u2n-tag');

    const avatarSrc = user?.avatarSrc || '';

    tagEl.innerHTML = `${avatarSrc ? `<img src="${user?.avatarSrc}" /> ` : ''}<span>${displayName}</span>`;

    tagsHolderEl.append(tagEl);

    el.append(tagsHolderEl);
  });
};

    const rerender = () => {
  renderUsers();
  renderApp();
};

    const getUserFromHovercardIfPossible = () => {
  const elHovercard = document.querySelector('.user-hovercard-avatar');

  if (elHovercard) {
    const avatarSrc = elHovercard.querySelector('.avatar-user')?.getAttribute('src')?.split('?')[0] || '';
    const id = avatarSrc ? avatarSrc.match(/u\/([0-9]+)?/)[1] : '';
    const username = elHovercard.querySelector('.avatar-user')?.getAttribute('alt')?.replace('@', '').trim();
    const name = elHovercard.parentNode.parentNode.querySelector(`.Link--secondary[href="/${username}"]`)?.textContent?.trim() || '';

    return {
      id,
      username,
      avatarSrc,
      name,
    };
  }

  return undefined;
};

const saveNewUsersIfPossible = () => {
  const newUser = getUserFromHovercardIfPossible();

  if (newUser) {
    saveNewUser(newUser);
  }
};


    saveNewUsersIfPossible();
    rerender();

    const debouncedRefresh = debounce(() => {
      saveNewUsersIfPossible();
      rerender();
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

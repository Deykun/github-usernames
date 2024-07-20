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
    const saveNewUsers = (usersByNumber = {}) => {
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

  return true;
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

const IconUsers = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<path d="M10.644 17.08c2.866-.662 4.539-1.241 3.246-3.682C9.958 5.971 12.848 2 17.001 2c4.235 0 7.054 4.124 3.11 11.398-1.332 2.455.437 3.034 3.242 3.682 2.483.574 2.647 1.787 2.647 3.889V22H8c0-2.745-.22-4.258 2.644-4.92zM-2 22h7.809c-.035-8.177 3.436-5.313 3.436-11.127C9.245 8.362 7.606 7 5.497 7 2.382 7 .215 9.979 3.164 15.549c.969 1.83-1.031 2.265-3.181 2.761C-1.879 18.74-2 19.65-2 21.227V22z"/>
</svg>`;

    appendCSS(`
  :root {
    --u2u-nav-item-size: 25px;
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
  }

  .u2u-nav-item {
    padding: 0;
    height: var(--u2u-nav-item-size);
    width: var(--u2u-nav-item-size);
    line-height: var(--u2u-nav-item-size);
    border: 1px solid var(--u2u-nav-item-border);
    color: var(--u2u-nav-item-text);
    background: var(--u2u-nav-item-bg);
  }

  .u2u-nav-item:hover {
    color: var(--u2u-nav-item-text-hover);
  }

  .u2u-nav-item svg {
    fill: currentColor;
    padding: 20%;
    height: var(--u2u-nav-item-size);
    width: var(--u2u-nav-item-size);
    line-height: var(--u2u-nav-item-size);
  }
`, { sourceName: 'render-app' });

const renderApp = () => {
  render(`<aside class="u2u-nav">
    <button class="u2u-nav-item">${IconUsers}</button>
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
    const wasUpdated = JSON.stringify(window.U2N.usersByUsernames?.[newUser.username])
      !== JSON.stringify(newUser);

    if (wasUpdated) {
      saveNewUsers({
        [newUser.username]: newUser,
      });
    }
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

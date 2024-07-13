// ==UserScript==
// @namespace       deykun
// @name            Usernames to names - GitHub
// @description     Replace the username with the actual name of the user from their profile. This is useful if you work in an organization where usernames are ambiguous.
// @author          deykun
// @version         0.9
// @include	        https://*github.com*
// @grant           none
// @run-at		    document-start
// @updateURL       https://raw.githubusercontent.com/Deykun/github-usernames-to-names/main/github-usernames-to-names.user-srcipt.js
// @downloadURL     https://raw.githubusercontent.com/Deykun/github-usernames-to-names/main/github-usernames-to-names.user-srcipt.js
// ==/UserScript==

'use strict';

window.U2N = {
  version: 0.9,
  isDevMode: true,
  cache: { },
}

const userScriptLogger = (params) => {
    if (params.isError) {
        const { isCritical = false, message = '', error } = params;

        if (isCritical) {
            console.error(`A User2Names error (from Tampermonkey) has occurred. You can ignore it, or describe the error and create an issue here: https://github.com/Deykun/github-usernames-to-names/issues`);
            console.error(`U2N error: ${message}`);
            console.error(error);
        }

        if (window.U2N.isDevMode && error) {
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
    const appendCSS = (styles, { sourceName = '' } = {}) => {
  const appendOnceSelector = sourceName ? `g-u2n-cache-${sourceName}`.trim() : undefined;
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


window.U2N.cache.HTML = {};

const render = (HTML = '', id) => {
    if (HTML === window.U2N.cache.HTML[id]) {
        /* Don't rerender if HTML is the same */
        return;
    }

    window.U2N.cache.HTML[id] = HTML;

    const wrapperEl = document.getElementById(id);

    if (!HTML) {
        wrapperEl?.remove();

        return;
    }

    if (wrapperEl) {
        wrapperEl.innerHTML = HTML;

        return;
    }

    const el = document.createElement('div');
    el.id = id;
    el.innerHTML = HTML;

    document.body.appendChild(el);
};
    const getUserElements = () => {
  const links = Array.from(document.querySelectorAll('[data-hovercard-url^="/users/"]')).map((el) => {
    const username = el.getAttribute('data-hovercard-url').match(/users\/([A-Za-z0-9_-]+)\//)[1]
    if (el.textContent.includes(username)) {
      return {
        el,
        username,
      }
    }

    return null;
  }).filter(Boolean)

  return links;
}

appendCSS(`
  [data-u2n-username]::after {
    display: inline-block;
    align-self: center;
    content: attr(data-u2n-username);
    margin-left: 3px;
    padding: 0 6px;
    border-radius: 4px;
    font-size: 12px;
    letter-spacing: 0.05em;
    font-weight: 600;
    font-style: normal;
    text-transform: capitalize;
    text-decoration: none !important;
    line-height: 19px;
    height: 18px;
    white-space: nowrap;
    color: #00293e;
    background-color: #f2f2f2;
    transition: 0.15s ease-in-out; 
  }

  [data-u2n-username]:hover::after {
    color: #0054ae !important;
    background: #dbedff !important;
  }

`, { sourceName: 'render-users' })

const renderUsers = () => {
  const elements = getUserElements();

  elements.forEach(({ el, username }) => el.setAttribute('data-u2n-username', username))
}


    renderUsers();

    } catch (error) {
        userScriptLogger({
            isError: true, isCritical: true, message: 'initU2N() failed', error,
        });

        throw error;
    }
};

domReady(initU2N);

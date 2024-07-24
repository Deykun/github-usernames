// ==UserScript==
// @namespace       deykun
// @name            Usernames to names - GitHub
// @description     Replace ambiguous usernames with actual names from user profiles.
// @author          deykun
// @version         SCRIPT_VERSION
// @include         https://github.com*
// @grant           none
// @run-at          document-start
// @updateURL       https://raw.githubusercontent.com/Deykun/github-usernames/main/github-usernames.user-srcipt.js
// @downloadURL     https://raw.githubusercontent.com/Deykun/github-usernames/main/github-usernames.user-srcipt.js
// ==/UserScript==

'use strict';

/* import @/constants.js */

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
    /* import @/db.js */
    /* import @/dom.js */
    /* import @/helpers.js */
    /* import @/icons.js */
    /* import @/interface.js */
    /* import @/render-app-settings.js */
    /* import @/render-app-status.js */
    /* import @/render-app-theme.js */
    /* import @/render-app-user.js */
    /* import @/render-app.js */
    /* import @/render-status.js */
    /* import @/render-users.js */
    /* import @/render.js */
    /* import @/save-users.js */

    saveNewUsersIfPossible();
    renderUsers();
    renderStatus();
    renderApp();

    /* import @/subscribers.js */

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

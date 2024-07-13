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
    /* import @/dom.js */
    /* import @/render-users.js */

    renderUsers();

    } catch (error) {
        userScriptLogger({
            isError: true, isCritical: true, message: 'initU2N() failed', error,
        });

        throw error;
    }
};

domReady(initU2N);

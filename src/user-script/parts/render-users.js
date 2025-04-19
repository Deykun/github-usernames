const dataU2NSource = 'data-u2n-source';

const getUserElements = () => {
  const hovercardUrls = Array.from(document.querySelectorAll('[data-hovercard-url^="/users/"]')).map((el) => {
    const username = el.getAttribute('data-hovercard-url').match(/users\/([A-Za-z0-9_-]+)\//)[1];

    if (username && el.textContent.includes(username)) {
      return {
        el,
        username,
      };
    }

    return undefined;
  }).filter(Boolean);

  const kanbanListItems = Array.from(document.querySelectorAll('[class*="slicer-items-module__title"]')).map((el) => {
    const username = el.getAttribute(dataU2NSource) || el.textContent.trim();

    const isSavedUser = getIsSavedUser(username);
    if (isSavedUser) {
      return {
        el,
        username,
      };
    }

    return undefined;
  }).filter(Boolean);

  const tooltipsItems = Array.from(document.querySelectorAll('[data-visible-text]')).map((el) => {
    const username = el.getAttribute(dataU2NSource) || el.getAttribute('data-visible-text').trim();

    const isSavedUser = getIsSavedUser(username);
    if (isSavedUser) {
      return {
        el,
        username,
        updateAttributeInstead: 'data-visible-text',
      };
    }

    return undefined;
  }).filter(Boolean);

  return [
    ...hovercardUrls,
    ...kanbanListItems,
    ...tooltipsItems,
  ];
};

const getGroupedUserElements = () => {
  /* Example page https://github.com/orgs/input-output-hk/projects/102/ */
  const projectsCellItems = Array.from(document.querySelectorAll('[role="gridcell"]:has([data-component="Avatar"] + span, [data-avatar-count] + span)')).map((el) => {
    const source = el.getAttribute(dataU2NSource) || el.textContent.trim() || '';
    const usernames = source.replace(' and ', ', ').split(', ').filter(Boolean);

    const hasSavedUsername = (usernames?.length || 0) > 0 && usernames.some(getIsSavedUser);

    if (hasSavedUsername) {
      return {
        el,
        usernames,
        source,
      };
    }

    return undefined;
  }).filter(Boolean);

  return [
    ...projectsCellItems,
  ];
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
    display: inline-flex;
    justify-content: start;
    vertical-align: middle;
    font-size: 0;
    text-overflow: unset !important;
  }

  [data-u2n-cache-user] [class*="ActionList-ActionListSubContent"] {
    display: none;
  }
  
  .user-mention[data-u2n-cache-user] {
    background-color: transparent !important;
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
    '[data-testid="list-row-repo-name-and-number"]', // prs in repo
    '[data-issue-and-pr-hovercards-enabled] [id*="issue_"]', // prs in repo
    '[data-issue-and-pr-hovercards-enabled] [id*="check_"]', // actions in repo
    '.timeline-comment-header', // comments headers
    '.comment-body', // comments body
  ], [
    ['.u2n-tag-avatar', 'display: inline-block;'],
    ['.u2n-tag-avatar + *', 'margin-left: 1.5em;'],
  ])}
`, { sourceName: 'render-users' });

export const renderUsers = () => {
  const {
    color,
    shouldShowAvatars,
  } = window.U2N.settings;

  const shouldUpdateTheme = document.body.getAttribute('data-u2n-color') !== color;
  if (shouldUpdateTheme) {
    document.body.setAttribute('data-u2n-color', color);
  }

  const userElements = getUserElements();

  userElements.forEach(({ el, username: usernameFromElement, updateAttributeInstead }) => {
    const username = usernameFromElement;
    const user = window.U2N.usersByUsernames?.[username];
    const displayName = getDisplayNameByUsername(username);
    const previousCacheValue = el.getAttribute('data-u2n-cache-user') || '';

    const cacheValue = `${username}|${displayName}${user ? '+u' : '-u'}${shouldShowAvatars ? '+a' : '-a'}`;

    const isAlreadySet = previousCacheValue === cacheValue;
    if (isAlreadySet) {
      return;
    }

    el.setAttribute(dataU2NSource, username);
    el.setAttribute('data-u2n-cache-user', cacheValue);

    if (updateAttributeInstead) {
      el.setAttribute(updateAttributeInstead, displayName);

      return;
    }

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

  const groupedUsersElements = getGroupedUserElements();

  groupedUsersElements.forEach(({ el, usernames: usernamesFromElement, source }) => {
    const hasSavedUsername = usernamesFromElement.some(getIsSavedUser);

    if (!hasSavedUsername) {
      return;
    }

    const displayNames = usernamesFromElement.map((username) => getDisplayNameByUsername(username));
    const displayNamesString = joinWithAnd(displayNames);

    const previousCacheValue = el.getAttribute('data-u2n-cache-user') || '';

    const cacheValue = `${source}|${displayNamesString}${shouldShowAvatars ? '+a' : '-a'}`;

    const isAlreadySet = previousCacheValue === cacheValue;
    if (isAlreadySet) {
      return;
    }

    el.setAttribute(dataU2NSource, source);
    el.setAttribute('data-u2n-cache-user', cacheValue);

    Array.from(el.querySelectorAll('span')).at(-1).textContent = displayNamesString;
  });
};

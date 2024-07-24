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
  [data-u2n-cache-user] {
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
    color: #00293e;
    background-color: #f2f2f2;
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
    color: #0054ae !important;
    background: #dbedff !important;
  }

  /* We hide them and show them only in verified locations */
  .u2n-tag-avatar {
    display: none;
  }

  ${nestedSelectors([
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

export const renderUsers = () => {
  const elements = getUserElements();
  const {
    shouldShowAvatars,
  } = window.U2N.settings;

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

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
  [data-u2n-display-name]::after {
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
  }

  [data-u2n-display-name]:hover::after {
    color: #0054ae !important;
    background: #dbedff !important;
  }

`, { sourceName: 'render-users' });

export const renderUsers = () => {
  const elements = getUserElements();

  elements.forEach(({ el, username }) => {
    const name = window.U2N.usersByUsernames?.[username]?.name;
    if (!name) {
      return;
    }

    const [firstName, ...rest] = name.toLowerCase().split(' ');

    const displayName = `@${firstName} ${rest.map((nextName) => `${nextName.at(0)}.`).join(' ')}`;

    el.setAttribute('data-u2n-display-name', displayName);
  });
};

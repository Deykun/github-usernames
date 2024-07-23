const debounce = (fn, time) => {
  let timeoutHandler;

  return (...args) => {
    clearTimeout(timeoutHandler);
    timeoutHandler = setTimeout(() => {
      fn(...args);
    }, time);
  };
};

export const upperCaseFirstLetter = (text) => (typeof text === 'string' ? text.charAt(0).toUpperCase() + text.slice(1) : '');

export const getShouldUseUsernameAsDisplayname = (username) => {
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

export const getDisplayNameByUsername = (username) => {
  if (getShouldUseUsernameAsDisplayname(username)) {
    return username;
  }

  const user = window.U2N.usersByUsernames?.[username];
  const customDisplayName = window.U2N.customNamesByUsernames?.[username];

  if (customDisplayName) {
    return customDisplayName;
  }

  let displayName = user ? user?.username : username;
  if (user?.name) {
    const [firstName, ...rest] = user.name.toLowerCase().split(' ');

    displayName = `${upperCaseFirstLetter(firstName)} ${rest.map((nextName) => `${nextName.at(0).toUpperCase()}.`).join(' ')}`;
  }

  return displayName;
};

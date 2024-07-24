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

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

export const joinWithAnd = (items) => {
  if (items.length === 0) {
    return '';
  }
  if (items.length === 1) {
    return items[0];
  }
  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  const allButLast = items.slice(0, -1).join(', ');
  const last = items[items.length - 1];
  return `${allButLast} and ${last}`;
};

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
    name: nameSetting,
    shouldShowUsernameWhenBetter,
  } = window.U2N.settings;

  if (nameSetting === 'username') {
    return username;
  }

  const subnames = user.name.split(' ').filter(Boolean).map((subname) => upperCaseFirstLetter(subname));

  if (shouldShowUsernameWhenBetter) {
    const nameToCompare = subnames.join(' ');
    const totalNamesLetters = nameToCompare.match(/[a-zA-Z]/gi).length;
    const totalUsernamesLetters = username.match(/[a-zA-Z]/gi).length;

    const isUsernameBetter = totalNamesLetters < totalUsernamesLetters && totalNamesLetters < 7;

    if (isUsernameBetter) {
      return username;
    }
  }

  if (nameSetting === 'name-surname') {
    return subnames.join(' ');
  }

  const [firstName, ...restOfNames] = subnames;

  if (nameSetting === 'name-s') {
    return [firstName, ...restOfNames.map((subname) => `${subname.at(0)}.`)].join(' ');
  }

  if (nameSetting === 'name') {
    return firstName;
  }

  const [lastName, ...firstNamesReversed] = subnames.reverse();
  const firstNames = firstNamesReversed.reverse();

  // n-surname
  return [firstNames.map((subname) => `${subname.at(0)}.`), lastName].join(' ');
};

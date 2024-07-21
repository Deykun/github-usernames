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

export const getDisplayNameByUsername = (username) => {
  const user = window.U2N.usersByUsernames?.[username];

  let displayName = user ? user?.username : username;
  if (user?.name) {
    const [firstName, ...rest] = user.name.toLowerCase().split(' ');

    displayName = `${upperCaseFirstLetter(firstName)} ${rest.map((nextName) => `${nextName.at(0).toUpperCase()}.`).join(' ')}`;
  }

  return displayName;
};

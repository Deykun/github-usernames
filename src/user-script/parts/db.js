const updateStatus = ({ type = '', text = '' }) => {
  if (window.U2N.cache.status) {
    clearTimeout(window.U2N.cache.status);
  }

  window.U2N.ui.status = {
    type,
    text,
  };

  renderApp();

  window.U2N.cache.status = setTimeout(() => {
    window.U2N.ui.status = {
      type: '',
      text: '',
    };

    renderApp();
  }, 3500);
};

const saveNewUsers = (usersByNumber = {}, params = {}) => {
  const oldUserByUsernames = getUsersByUsernamesFromLS();

  const newUserByUsernames = Object.entries(usersByNumber).reduce((stack, [username, value]) => {
    const isValidUsername = username && !username.includes(' ');
    if (isValidUsername) {
      stack[username] = value;
    }

    return stack;
  }, JSON.parse(JSON.stringify(oldUserByUsernames)));

  const didChange = JSON.stringify(oldUserByUsernames) !== JSON.stringify(newUserByUsernames);

  if (!didChange) {
    return false;
  }

  window.U2N.usersByUsernames = newUserByUsernames;
  localStorage.setItem('u2n-users', JSON.stringify(window.U2N.usersByUsernames));

  renderUsers();
  updateStatus({
    type: 'users-update',
    text: params.customStatusText || "The users' data were updated.",
  });

  return true;
};

const saveNewUser = (newUser) => {
  if (newUser.username) {
    const wasUpdated = JSON.stringify(window.U2N.usersByUsernames?.[newUser.username])
    !== JSON.stringify(newUser);

    if (wasUpdated) {
      return saveNewUsers({
        [newUser.username]: newUser,
      }, { customStatusText: `<strong>${newUser.username}</strong>'s data was updated.` });
    }
  }

  return false;
};

const saveDisplayNameForUsername = (username, name) => {
  if (!username) {
    return false;
  }

  const customNamesByUsernames = getCustomNamesByUsernamesFromLS();

  if (name) {
    customNamesByUsernames[username] = name;
  } else {
    delete customNamesByUsernames[username];
  }

  window.U2N.customNamesByUsernames = customNamesByUsernames;

  localStorage.setItem('u2n-users-names', JSON.stringify(customNamesByUsernames));

  renderUsers();
  updateStatus({
    type: 'users-update',
    text: `<strong>${username}</strong>'s display name was updated.`,
  });

  return true;
};

const resetUsers = () => {
  localStorage.removeItem('u2n-users');
  localStorage.removeItem('u2n-users-names');
  window.U2N.usersByUsernames = {};
  window.U2N.customNamesByUsernames = {};
  renderUsers();
  updateStatus({
    type: 'users-reset',
    text: "The users' data were removed.",
  });
};

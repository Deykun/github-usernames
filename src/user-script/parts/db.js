const updateStatus = ({ type = '', text = '' }) => {
  if (window.U2N.cache.status) {
    clearTimeout(window.U2N.cache.status);
  }

  window.U2N.status = {
    type,
    text,
  };

  renderApp();

  window.U2N.cache.status = setTimeout(() => {
    window.U2N.status = {
      type: '',
      text: '',
    };

    renderApp();
  }, 2000);
};

const saveNewUsers = (usersByNumber = {}, params = {}) => {
  const oldUserByUsernames = localStorage.getItem('u2n-users')
    ? JSON.parse(localStorage.getItem('u2n-users'))
    : {};

  const newUserByUsernames = Object.entries(usersByNumber).reduce((stack, [username, value]) => {
    stack[username] = value;

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
    type: 'default',
    text: params.customStatusText || 'New users data was added',
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
      }, { customStatusText: `<strong>${newUser.username}</strong>'s data was added` });
    }
  }

  return false;
};

const resetUsers = () => {
  localStorage.removeItem('u2n-users');
  window.U2N.usersByUsernames = {};
  renderUsers();
};

window.U2N.actions.resetUsers = resetUsers;

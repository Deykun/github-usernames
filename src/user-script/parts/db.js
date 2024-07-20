const saveNewUsers = (usersByNumber = {}) => {
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

  return true;
};

const resetUsers = () => {
  localStorage.removeItem('u2n-users');
  window.U2N.usersByUsernames = {};
  renderUsers();
};

window.U2N.actions.resetUsers = resetUsers;

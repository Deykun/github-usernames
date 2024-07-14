const saveNewUsers = (usersByNumber = {}) => {
  const oldUserById = localStorage.getItem('u2n-users')
    ? JSON.parse(localStorage.getItem('u2n-users'))
    : {};

  const newUserById = Object.entries(usersByNumber).reduce((stack, [id, value]) => {
    stack[id] = value;

    return stack;
  }, oldUserById);

  const didChange = JSON.stringify(oldUserById) !== JSON.stringify(newUserById);

  if (!didChange) {
    return false;
  }

  window.U2N.usersByIds = newUserById;
  localStorage.setItem('u2n-users', JSON.stringify(window.U2N.usersByIds));

  renderUsers();

  return true;
};

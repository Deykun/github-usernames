export const getUserFromHovercardIfPossible = () => {
  const elHovercard = document.querySelector('.user-hovercard-avatar');

  if (elHovercard) {
    try {
      const avatarEl = elHovercard.querySelector('.avatar-user');
      const avatarSrc = avatarEl?.getAttribute('src')?.split('?')[0] || '';
      const id = avatarSrc ? avatarSrc.match(/u\/([0-9]+)?/)[1] : '';
      const username = avatarEl?.getAttribute('alt')?.replace('@', '').trim();
      const name = elHovercard.parentNode.parentNode.querySelector(`.Link--secondary[href="/${username}"]`)?.textContent?.trim() || '';

      return {
        id,
        username,
        avatarSrc,
        name,
      };
    } catch (error) {
      userScriptLogger({
        isError: true, message: 'getUserFromHovercardIfPossible() failed while parsing the card', error,
      });
    }
  }

  return undefined;
};

export const getUsersFromPeopleListIfPossible = () => {
  if (!location.pathname.includes('/people')) {
    return [];
  }

  try {
    const usersEls = Array.from(document.querySelectorAll('li[data-bulk-actions-id]'));

    const users = usersEls.map((el) => {
      const avatarEl = el.querySelector('.avatar-user');
      const avatarSrc = avatarEl?.getAttribute('src')?.split('?')[0] || '';
      const id = avatarSrc ? avatarSrc.match(/u\/([0-9]+)?/)[1] : '';
      const username = avatarEl?.getAttribute('alt')?.replace('@', '').trim();
      const name = Array.from(
        el.querySelector('[data-test-selector="linked-name-is-full-if-exists"]').childNodes,
      ).find((child) => child.nodeType === Node.TEXT_NODE).textContent.trim();

      return {
        id,
        username,
        avatarSrc,
        name,
      };
    });

    return users;
  } catch (error) {
    userScriptLogger({
      isError: true, message: 'getUsersFromPeopleListIfPossible() failed while parsing the people list', error,
    });
  }

  return [];
};

export const saveNewUsersIfPossible = () => {
  const newUserFromHoverCard = getUserFromHovercardIfPossible();
  if (newUserFromHoverCard) {
    saveNewUser(newUserFromHoverCard);
  }

  const newUsersFromPeopleList = getUsersFromPeopleListIfPossible();
  if (newUsersFromPeopleList.length > 0) {
    saveNewUsers(newUsersFromPeopleList.reduce((stack, user) => {
      stack[user.username] = user;

      return stack;
    }, {}), { customStatusText: `<strong>${newUsersFromPeopleList.length} users'</strong> data were updated` });
  }
};

export const getUserFromUserPageIfPossible = () => {
  const elProfile = document.querySelector('.page-profile .js-profile-editable-replace');

  if (elProfile) {
    try {
      const avatarEl = elProfile.querySelector('.avatar-user');
      const avatarSrc = avatarEl?.getAttribute('src')?.split('?')[0] || '';
      const id = avatarSrc ? avatarSrc.match(/u\/([0-9]+)?/)[1] : '';
      const username = elProfile.querySelector('.vcard-username')?.textContent?.trim() || '';
      const name = elProfile.querySelector('.vcard-fullname')?.textContent?.trim() || '';

      return {
        id,
        username,
        avatarSrc,
        name,
      };
    } catch (error) {
      userScriptLogger({
        isError: true, message: 'getUserFromUserPageIfPossible() failed while parsing the profile', error,
      });
    }
  }

  return undefined;
};

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
  const userFromProfile = getUserFromUserPageIfPossible();
  if (userFromProfile) {
    saveNewUser(userFromProfile);
  }

  const userFromHoverCard = getUserFromHovercardIfPossible();
  if (userFromHoverCard) {
    saveNewUser(userFromHoverCard);
  }

  const usersFromPeopleList = getUsersFromPeopleListIfPossible();
  if (usersFromPeopleList.length > 0) {
    saveNewUsers(usersFromPeopleList.reduce((stack, user) => {
      stack[user.username] = user;

      return stack;
    }, {}), { customStatusText: `<strong>${usersFromPeopleList.length} users'</strong> data were updated` });
  }
};

export const getUserFromHovercardIfPossible = () => {
  const elHovercard = document.querySelector('.user-hovercard-avatar');

  if (elHovercard) {
    const avatarSrc = elHovercard.querySelector('.avatar-user')?.getAttribute('src')?.split('?')[0] || '';
    const id = avatarSrc ? avatarSrc.match(/u\/([0-9]+)?/)[1] : '';
    const username = elHovercard.querySelector('.avatar-user')?.getAttribute('alt')?.replace('@', '').trim();
    const name = elHovercard.parentNode.parentNode.querySelector(`.Link--secondary[href="/${username}"]`)?.textContent?.trim() || '';

    if (!username) {
      return undefined;
    }

    return {
      id,
      username,
      avatarSrc,
      name,
    };
  }

  return undefined;
};

export const saveNewUsersIfPossible = () => {
  const newUser = getUserFromHovercardIfPossible();

  if (newUser) {
    const wasUpdated = JSON.stringify(window.U2N.usersByUsernames?.[newUser.username])
      !== JSON.stringify(newUser);

    if (wasUpdated) {
      saveNewUsers({
        [newUser.username]: newUser,
      });
    }
  }
};

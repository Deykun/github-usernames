const saveNewUsers = () => {};

export const getUserFromHovercardIfPossible = () => {
  const elHovercard = document.querySelector('.user-hovercard-avatar');

  if (elHovercard) {
    const avatarSrc = elHovercard.querySelector('.avatar-user')?.getAttribute('src')?.split('?')[0];
    const id = avatarSrc ? avatarSrc.match(/u\/([0-9]+)?/)[1] : undefined;
    const username = elHovercard.querySelector('.avatar-user')?.getAttribute('alt')?.replace('@', '').trim();
    const name = elHovercard.parentNode.parentNode.querySelector(`.Link--secondary[href="/${username}"]`)?.textContent?.trim();

    return {
      id,
      username,
      avatarSrc,
      name,
    };

    // const elUserNickClick = elHovercard.parentNode.nextElementSibling;
  }

  return undefined;
};

import { describe, expect, it } from 'vitest';
import { render } from './dom';
import { getUserFromHovercardIfPossible } from './save-users';
import { HTML as HOVERCARD_HTML } from './mocks/save-users/hovercard';

describe('getUserFromHovercardIfPossible', () => {
  it('should return user data from hover card', () => {
    render(HOVERCARD_HTML, 'test-wrapper');

    const result = getUserFromHovercardIfPossible();

    expect(result).toEqual({
      id: '21176665',
      username: 'Deykun',
      avatarSrc: 'https://avatars.githubusercontent.com/u/21176665',
      name: 'Szymon Tondowski',
    });
  });

  it('should return nothing if hovercard is not available', () => {
    render('', 'test-wrapper');

    const result = getUserFromHovercardIfPossible();

    expect(result).toBeUndefined();
  });
});

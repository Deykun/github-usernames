import { describe, expect, it } from 'vitest';
import { render } from './dom';
import { getUserFromHovercardIfPossible, getUsersFromPeopleListIfPossible } from './save-users';
import { HTML as HOVERCARD_HTML } from './mocks/save-users/hovercard';
import { HTML as PEOPLE_LIST_HTML } from './mocks/save-users/people-list';

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

const realLocation = window.location;

describe('getUsersFromPeopleListIfPossible', () => {
  afterEach(() => {
    window.location = realLocation;
  });

  it("should return 30 users' data from people list", () => {
    delete window.location;
    window.location = new URL('http://github.com/people');

    render(PEOPLE_LIST_HTML, 'test-wrapper');

    const result = getUsersFromPeopleListIfPossible();

    expect(result.length).toEqual(30);

    expect(result[0]).toEqual({
      avatarSrc: 'https://avatars.githubusercontent.com/u/32769793',
      id: '32769793',
      name: 'Kunal Sonawane',
      username: '2knal',
    });
  });
});

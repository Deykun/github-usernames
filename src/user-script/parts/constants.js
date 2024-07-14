window.U2N = {
  version: 0.9,
  isDevMode: true,
  cache: {
    HTML: {},
    CSS: {},
  },
  usersByIds: localStorage.getItem('u2n-users') ? JSON.parse(localStorage.getItem('u2n-users')) : {},
};

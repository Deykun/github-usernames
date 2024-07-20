window.U2N = {
  version: 0.9,
  isDevMode: true,
  cache: {
    HTML: {},
    CSS: {},
    status: null,
  },
  status: {
    type: '',
    text: '',
  },
  usersByUsernames: localStorage.getItem('u2n-users') ? JSON.parse(localStorage.getItem('u2n-users')) : {},
  actions: {},
};

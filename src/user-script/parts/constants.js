window.U2N = {
  version: 0.9,
  isDevMode: true,
  cache: {
    HTML: {},
    CSS: {},
    inited: false,
    status: null,
    location: location.href,
  },
  usersByUsernames: localStorage.getItem('u2n-users') ? JSON.parse(localStorage.getItem('u2n-users')) : {},
  actions: {},
};

window.U2N.ui = {
  status: {
    type: '',
    text: '',
  },
  openedContent: '',
  eventsSubscribers: {},
};

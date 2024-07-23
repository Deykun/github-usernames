const getFromLocalStorage = (key, defaultValues = {}) => (localStorage.getItem(key)
  ? { ...defaultValues, ...JSON.parse(localStorage.getItem(key)) }
  : { ...defaultValues });

const getSettingsFromLS = () => getFromLocalStorage('u2n-settings', {
  colors: 'light',
  names: 'names-s',
});

const getUsersByUsernamesFromLS = () => getFromLocalStorage('u2n-users');
const getCustomNamesByUsernamesFromLS = () => getFromLocalStorage('u2n-users-names');

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
  settings: getSettingsFromLS(),
  usersByUsernames: getUsersByUsernamesFromLS(),
  customNamesByUsernames: getCustomNamesByUsernamesFromLS(),
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

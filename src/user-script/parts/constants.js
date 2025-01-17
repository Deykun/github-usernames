const getFromLocalStorage = (key, defaultValues = {}) => (localStorage.getItem(key)
  ? { ...defaultValues, ...JSON.parse(localStorage.getItem(key)) }
  : { ...defaultValues });

const defaultSettings = {
  color: 'light',
  name: 'name-s',
  shouldShowUsernameWhenBetter: true,
  shouldShowAvatars: true,
  shouldFilterBySubstring: false,
  filterSubstring: '',
};

const getSettingsFromLS = () => getFromLocalStorage('u2n-settings', defaultSettings);
const getUsersByUsernamesFromLS = () => getFromLocalStorage('u2n-users');
const getCustomNamesByUsernamesFromLS = () => getFromLocalStorage('u2n-users-names');

window.U2N = {
  version: 'SCRIPT_VERSION',
  isDevMode: false,
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

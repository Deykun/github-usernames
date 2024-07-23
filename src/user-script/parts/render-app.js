appendCSS(`
  :root {
    --u2n-nav-item-size: 35px;
    --u2n-nav-item-bg: var(--bgColor-muted);
    --u2n-nav-item-bg: var(--bgColor-default);
    --u2n-nav-item-text-strong: var(--fgColor-default);
    --u2n-nav-item-text: var(--fgColor-muted);
    --u2n-nav-item-text-hover: var(--fgColor-accent);
    --u2n-nav-item-border: var(--borderColor-muted);
    --u2n-nav-item-radius: 5px;
  }

  .u2n-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    right: 30px;
    height: var(--u2n-nav-item-size);
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.06));
  }

  .u2n-nav > * + * {
    margin-left: -1px;
  }

  .u2n-nav > :first-child {
    border-top-left-radius: var(--u2n-nav-item-radius);
  }

  .u2n-nav > :last-child {
    border-top-right-radius: var(--u2n-nav-item-radius);
  }

  .u2n-nav-status,
  .u2n-nav-button-wrapper {
    height: var(--u2n-nav-item-size);
    min-width: var(--u2n-nav-item-size);
    line-height: var(--u2n-nav-item-size);
    border: 1px solid var(--u2n-nav-item-border);
    border-bottom-width: 0px;
    background: var(--u2n-nav-item-bg);
  }

  .u2n-nav-button-wrapper {
    position: relative;
  }

  .u2n-nav-button {
    background: transparent;
    border: none;
    padding: 0;
    color: var(--u2n-nav-item-text);
    width: var(--u2n-nav-item-size);
    transition: 0.3s ease-in-out;
  }

  .u2n-nav-button:hover {
    color: var(--u2n-nav-item-text-hover);
  }

  .u2n-nav-button--active {
    color: var(--u2n-nav-item-text-strong);
  }

  .u2n-nav-button svg {
    fill: currentColor;
    padding: 25%;
    height: var(--u2n-nav-item-size);
    width: var(--u2n-nav-item-size);
    line-height: var(--u2n-nav-item-size);
  }

  .u2n-nav-popup {
    position: absolute;
    right: 0;
    bottom: calc(100% + 10px);
    width: 300px;
    color: var(--u2n-nav-item-text-strong);
    border: 1px solid var(--u2n-nav-item-border);
    border-radius: var(--u2n-nav-item-radius);
    border-bottom-right-radius: 0;
    background-color: var(--u2n-nav-item-bg);
  }

  .u2n-nav-popup-content {
    display: flex;
    flex-flow: column;
    gap: 15px;
    max-height: calc(100vh - 60px);
    overflow: auto;
    padding: 10px;
    padding-top: 0;
    font-size: 14px;
    line-height: 1.2;
    text-align: left;
  }

  .u2n-nav-popup-title {
    position: sticky;
    top: 0px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-top: 10px;
    padding-bottom: 5px;
    font-size: 16px;
    background-color: var(--u2n-nav-item-bg);
  }

  .u2n-nav-popup-title svg {
    fill: currentColor;
    height: 16px;
    width: 16px;
  }

  .u2n-nav-popup h4 {
    margin-bottom: 8px;
  }

  .u2n-nav-popup ul {
    display: flex;
    flex-flow: column;
    gap: 8px;
    list-style: none;
  }

  .u2n-nav-popup::after {
    content: '';
    position: absolute;
    bottom: -10px;
    right: calc((var(--u2n-nav-item-size) / 2) - 5px);
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-top-color: var(--u2n-nav-item-border);
  }

  .u2n-nav-popup-button {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    padding: 8px;
    border-radius: 3px;
    font-size: 14px;
    letter-spacing: 0.04em;
    text-decoration: none;
    background: none;
    border: none;
    color: var(--bgColor-default);
    background-color: var(--fgColor-success);
  }

  .u2n-nav-popup-button:hover {
    text-decoration: none;
  }

  .u2n-nav-popup-button svg {
    fill: currentColor;
    width: 18px;
    height: 18px;
  }
`, { sourceName: 'render-app' });

export const renderApp = () => {
  const content = window.U2N.ui.openedContent;

  render(`<aside class="u2n-nav" data-active="${content}">
    ${getAppStatus()}
    ${getAppUser({ isActive: content === 'user' })}
    ${getAppTheme({ isActive: content === 'theme' })}
    ${getAppSettings({ isActive: content === 'settings' })}
  </aside>`, 'u2n-app');
};

window.U2N.ui.eventsSubscribers.content = {
  selector: '.u2n-nav-button',
  handleClick: (_, calledByElement) => {
    if (calledByElement) {
      const content = calledByElement.getAttribute('data-content');
      const isClose = !content || content === window.U2N.ui.openedContent;

      if (isClose) {
        window.U2N.ui.openedContent = '';
      } else {
        window.U2N.ui.openedContent = content;
      }
    }

    renderApp();
  },
};

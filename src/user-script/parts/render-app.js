appendCSS(`
  :root {
    --u2u-nav-item-size: 35px;
    --u2u-nav-item-bg: var(--bgColor-muted);
    --u2u-nav-item-bg: var(--bgColor-default);
    --u2u-nav-item-text-strong: var(--fgColor-default);
    --u2u-nav-item-text: var(--fgColor-muted);
    --u2u-nav-item-text-hover: var(--fgColor-accent);
    --u2u-nav-item-border: var(--borderColor-muted);
    --u2u-nav-item-radius: 5px;
  }

  .u2u-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    right: 30px;
    height: var(--u2u-nav-item-size);
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.06));
  }

  .u2u-nav > * + * {
    margin-left: -1px;
  }

  .u2u-nav > :first-child {
    border-top-left-radius: var(--u2u-nav-item-radius);
  }

  .u2u-nav > :last-child {
    border-top-right-radius: var(--u2u-nav-item-radius);
  }

  .u2u-nav-status,
  .u2u-nav-button-wrapper {
    height: var(--u2u-nav-item-size);
    min-width: var(--u2u-nav-item-size);
    line-height: var(--u2u-nav-item-size);
    border: 1px solid var(--u2u-nav-item-border);
    border-bottom-width: 0px;
    background: var(--u2u-nav-item-bg);
  }

  .u2u-nav-status {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 0 10px;
    margin-right: 10px;
    border-top-right-radius: var(--u2u-nav-item-radius);
    border-color: var(--fgColor-success);
    color: var(--fgColor-default);
    font-size: 12px;
    transform: translateY(150px);
    animation: U2NSlideInFromTop 0.4s cubic-bezier(0.1, 0.7, 1, 0.1) forwards;
  }

  @keyframes U2NSlideInFromTop {
    0% {
      transform: translateY(150px);
    }
    100% {
      transform: translateY(0);
    }
  }

  .u2u-nav-status + * {
    border-top-left-radius: var(--u2u-nav-item-radius);
  }

  .u2u-nav-status svg {
    fill: currentColor;
    color: var(--fgColor-success);
    height: 14px;
    width: 14px;
  }

  .u2u-nav-button-wrapper {
    position: relative;
  }

  .u2u-nav-button {
    background: transparent;
    border: none;
    padding: 0;
    color: var(--u2u-nav-item-text);
    width: var(--u2u-nav-item-size);
    transition: 0.3s ease-in-out;
  }

  .u2u-nav-button:hover {
    color: var(--u2u-nav-item-text-hover);
  }

  .u2u-nav-button--active {
    color: var(--u2u-nav-item-text-strong);
  }

  .u2u-nav-button svg {
    fill: currentColor;
    padding: 25%;
    height: var(--u2u-nav-item-size);
    width: var(--u2u-nav-item-size);
    line-height: var(--u2u-nav-item-size);
  }

  .u2u-nav-popup {
    position: absolute;
    right: 0;
    bottom: calc(100% + 10px);
    width: 250px;
    color: var(--u2u-nav-item-text-strong);
    border: 1px solid var(--u2u-nav-item-border);
    border-radius: var(--u2u-nav-item-radius);
    border-bottom-right-radius: 0;
    background-color: var(--u2u-nav-item-bg);
  }

  .u2u-nav-popup-content {
    display: flex;
    flex-flow: column;
    gap: 10px;
    max-height: calc(100vh - 60px);
    overflow: auto;
    padding: 10px;
    padding-top: 0;
    font-size: 14px;
    line-height: 1.2;
    text-align: left;
  }

  .u2u-nav-popup-title {
    position: sticky;
    top: 0px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-top: 10px;
    padding-bottom: 5px;
    font-size: 16px;
    background-color: var(--u2u-nav-item-bg);
  }

  .u2u-nav-popup-title svg {
    fill: currentColor;
    height: 16px;
    width: 16px;
  }

  .u2u-nav-popup h4 {
    margin-bottom: 5px;
  }

  .u2u-nav-popup ul {
    list-style: none;
  }

  .u2u-nav-popup label {
    font-weight: 400;
  }

  .u2u-nav-popup label input {
    margin-left: 5px;
    margin-right: 5px;
  }

  .u2u-nav-popup::after {
    content: '';
    position: absolute;
    bottom: -10px;
    right: calc((var(--u2u-nav-item-size) / 2) - 5px);
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-top-color: var(--u2u-nav-item-border);
  }
`, { sourceName: 'render-app' });

export const renderApp = () => {
  const content = window.U2N.ui.openedContent;

  render(`<aside class="u2u-nav" data-active="${content}">
    ${getAppStatus()}
    ${getAppUser({ isActive: content === 'user' })}
    ${getAppTheme({ isActive: content === 'theme' })}
    ${getAppSettings({ isActive: content === 'settings' })}
  </aside>`, 'u2u-app');
};

window.U2N.ui.eventsSubscribers.content = {
  selector: '.u2u-nav-button',
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

appendCSS(`
  :root {
    --u2u-nav-item-size: 35px;
    --u2u-nav-item-bg: var(--bgColor-muted);
    --u2u-nav-item-bg: var(--bgColor-default);
    --u2u-nav-item-popup: var(--fgColor-default);
    --u2u-nav-item-text: var(--fgColor-muted);
    --u2u-nav-item-text-hover: var(--fgColor-accent);
    --u2u-nav-item-border: var(--borderColor-muted);
    --u2u-nav-item-radius: 5px;
  }

  .u2u-nav {
    position: fixed;
    bottom: 0;
    right: 30px;
    height: var(--u2u-nav-item-size);
    display: flex;
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
  }

  .u2u-nav-button:hover,
  .u2u-nav-button.u2u-nav-button--active {
    color: var(--u2u-nav-item-text-hover);
  }

  .u2u-nav-button svg {
    fill: currentColor;
    padding: 25%;
    height: var(--u2u-nav-item-size);
    width: var(--u2u-nav-item-size);
    line-height: var(--u2u-nav-item-size);
  }

  .u2u-nav-button-content {
    position: absolute;
    right: 0;
    bottom: calc(100% + 10px);
    display: flex;
    flex-flow: column;
    gap: 15px;
    width: 200px;
    line-height: 1.4;
    text-align: left;
    padding: 10px;
    color: var(--u2u-nav-item-popup);
    border: 1px solid var(--u2u-nav-item-border);
    border-radius: var(--u2u-nav-item-radius);
    border-bottom-right-radius: 0;
    background-color: var(--u2u-nav-item-bg);
  }

  .u2u-nav-button-content h4 {
    margin-bottom: 5px;
  }

  .u2u-nav-button-content ul {
    list-style: none;
  }

  .u2u-nav-button-content::after {
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
  const {
    text: statusText = '',
  } = window.U2N.ui.status;

  const content = window.U2N.ui.openedContent;

  render(`<aside class="u2u-nav" data-active="${content}">
    ${!statusText ? '' : `<span class="u2u-nav-status">${IconNewUser} <span>${statusText}</span></span>`}
    <span class="u2u-nav-button-wrapper">
      
      ${content !== 'theme'
    ? `<button class="u2u-nav-button" data-content="theme">${IconThemes}</button>`
    : `<button class="u2u-nav-button u2u-nav-button--active" data-content="">${IconThemes}</button>
    <div class="u2u-nav-button-content">
        <div>
          <h4>Colors</h4>
          <ul>
            <li>
              <label>
                <input type="radio" name="color" value="light" />
                <span>Light</span>
              </label>
            </li>
            <li>
              <label>
                <input type="radio" name="color" value="dark" />
                <span>Dark</span>
              </label>
            </li>
          </ul>
        </div>
        <div>
          <h4>Show avatar</h4>
          <ul>
            <li>
              <label>
                <input type="radio" name="avatar" value="1" />
                <span>Show</span>
              </label>
            </li>
            <li>
              <label>
                <input type="radio" name="avatar" value="0" />
                <span>Hide</span>
              </label>
            </li>
          </ul>
        </div>
      </div>`}
    </span>
    <span class="u2u-nav-button-wrapper">
    ${content !== 'settings'
    ? `<button class="u2u-nav-button" data-content="settings">${IconCog}</button>`
    : `<button class="u2u-nav-button u2u-nav-button--active" data-content="">${IconCog}</button>
    <div class="u2u-nav-button-content">
        <div>
          <p>
            You can report an issue here: <a href="https://github.com/Deykun/github-usernames-to-names" target="_blank">github.com/Deykun/github-usernames-to-names</a>
          </p>
        </div>
    </div>
    `}
    </span>
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

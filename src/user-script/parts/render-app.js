appendCSS(`
  :root {
    --u2u-nav-item-size: 35px;
    --u2u-nav-item-bg: var(--bgColor-muted);
    --u2u-nav-item-text: var(--fgColor-muted);
    --u2u-nav-item-text-hover: var(--fgColor-accent);
    --u2u-nav-item-border: var(--borderColor-muted);
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
    border-top-left-radius: 5px;
  }

  .u2u-nav > :last-child {
    border-top-right-radius: 5px;
  }

  .u2u-nav-status,
  .u2u-nav-button {
    height: var(--u2u-nav-item-size);
    min-width: var(--u2u-nav-item-size);
    line-height: var(--u2u-nav-item-size);
    border: 1px solid var(--u2u-nav-item-border);
    border-bottom-width: 0px;
    background: var(--u2u-nav-item-bg);
  }

  .u2u-nav-status {
    color: var(--fgColor-default);
    font-size: 12px;
    padding: 0 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  .u2u-nav-status svg {
    fill: currentColor;
    color: var(--fgColor-success);
    height: 14px;
    width: 14px;
  }

  .u2u-nav-button {
    padding: 0;
    color: var(--u2u-nav-item-text);
    width: var(--u2u-nav-item-size);
  }

  .u2u-nav-button:hover {
    color: var(--u2u-nav-item-text-hover);
  }

  .u2u-nav-button svg {
    fill: currentColor;
    padding: 25%;
    height: var(--u2u-nav-item-size);
    width: var(--u2u-nav-item-size);
    line-height: var(--u2u-nav-item-size);
  }
`, { sourceName: 'render-app' });

export const renderApp = () => {
  const {
    text: statusText = '',
  } = window.U2N.status;

  render(`<aside class="u2u-nav">
    ${!statusText ? '' : `<span class="u2u-nav-status">${IconNewUser} <span>${statusText}</span></span>`}
    <button class="u2u-nav-button">${IconThemes}</button>
    <button class="u2u-nav-button">${IconCog}</button>
  </aside>`, 'u2u-app');
};

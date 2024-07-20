appendCSS(`
  :root {
    --u2u-nav-item-size: 25px;
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
  }

  .u2u-nav-item {
    padding: 0;
    height: var(--u2u-nav-item-size);
    width: var(--u2u-nav-item-size);
    line-height: var(--u2u-nav-item-size);
    border: 1px solid var(--u2u-nav-item-border);
    color: var(--u2u-nav-item-text);
    background: var(--u2u-nav-item-bg);
  }

  .u2u-nav-item:hover {
    color: var(--u2u-nav-item-text-hover);
  }

  .u2u-nav-item svg {
    fill: currentColor;
    padding: 20%;
    height: var(--u2u-nav-item-size);
    width: var(--u2u-nav-item-size);
    line-height: var(--u2u-nav-item-size);
  }
`, { sourceName: 'render-app' });

export const renderApp = () => {
  render(`<aside class="u2u-nav">
    <button class="u2u-nav-item">${IconUsers}</button>
  </aside>`, 'u2u-app');
};

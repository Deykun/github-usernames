appendCSS(`
  .u2n-nav-status {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 50%;
    height: var(--u2n-nav-item-size);
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.08));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 0 10px;
    margin-right: 10px;
    border-top-left-radius: var(--u2n-nav-item-radius);
    border-top-right-radius: var(--u2n-nav-item-radius);
    color: var(--fgColor-default);
    font-size: 12px;
    transform: translateY(60px) translateX(-50%);
    animation: U2NSlideInFromTop 0.4s cubic-bezier(0.1, 0.7, 1, 0.1) forwards;
  }

  @keyframes U2NSlideInFromTop {
    0% {
      transform: translateY(60px) translateX(-50%);
    }
    100% {
      transform: translateY(0) translateX(-50%);
    }
  }

  .u2n-nav-status svg {
    fill: currentColor;
    color: var(--fgColor-success);
    height: 14px;
    width: 14px;
  }

  .u2n-nav-status--danger svg {
    color: var(--fgColor-danger);
  }
`, { sourceName: 'render-app-status' });

const StatusIconByType = {
  'users-update': IconNewUser,
  'users-reset': IconRemoveUsers,
  'settings-update': IconWrench,
};

export const renderStatus = () => {
  const {
    type,
    text: statusText = '',
  } = window.U2N.ui.status;

  if (!statusText) {
    render('', 'u2n-status');

    return;
  }

  const Icon = StatusIconByType[type] || '';
  const isNegative = ['users-reset'].includes(type);

  render(`<span class="u2n-nav-status ${isNegative ? 'u2n-nav-status--danger' : ''}">
  ${Icon} <span>${statusText}</span>
</span>`, 'u2n-status');
};

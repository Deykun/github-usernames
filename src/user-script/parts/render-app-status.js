appendCSS(`
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

  .u2u-nav-status--danger svg {
    color: var(--fgColor-danger);
  }
`, { sourceName: 'render-app-status' });

const StatusIconByType = {
  'users-update': IconNewUser,
  'users-reset': IconRemoveUsers,
};

export const getAppStatus = () => {
  const {
    type,
    text: statusText = '',
  } = window.U2N.ui.status;

  if (!statusText) {
    return '';
  }

  const Icon = StatusIconByType[type] || '';
  const isNegative = ['users-reset'].includes(type);

  return `<span class="u2u-nav-status ${isNegative ? 'u2u-nav-status--danger' : ''}">
    ${Icon} <span>${statusText}</span>
  </span>`;
};

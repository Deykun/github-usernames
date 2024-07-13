export const appendCSS = (styles, { sourceName = '' } = {}) => {
  const appendOnceSelector = sourceName ? `g-u2n-cache-${sourceName}`.trim() : undefined;
  if (appendOnceSelector) {
      /* Already appended */
      if (document.getElementById(appendOnceSelector)) {
          return;
      }
  }

  const style = document.createElement('style');
  if (sourceName) {
      style.setAttribute('id', appendOnceSelector);
  }

  style.innerHTML = styles;
  document.head.append(style);
};


window.U2N.cache.HTML = {};

export const render = (HTML = '', id) => {
    if (HTML === window.U2N.cache.HTML[id]) {
        /* Don't rerender if HTML is the same */
        return;
    }

    window.U2N.cache.HTML[id] = HTML;

    const wrapperEl = document.getElementById(id);

    if (!HTML) {
        wrapperEl?.remove();

        return;
    }

    if (wrapperEl) {
        wrapperEl.innerHTML = HTML;

        return;
    }

    const el = document.createElement('div');
    el.id = id;
    el.innerHTML = HTML;

    document.body.appendChild(el);
};
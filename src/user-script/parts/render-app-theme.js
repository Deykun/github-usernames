export const getAppTheme = ({ isActive = false }) => {
  return `<div class="u2u-nav-button-wrapper">
      ${!isActive
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
    </div>`;
};

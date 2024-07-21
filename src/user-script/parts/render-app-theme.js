export const getAppTheme = ({ isActive = false }) => {
  return `<div class="u2u-nav-button-wrapper">
      ${!isActive
    ? `<button class="u2u-nav-button" data-content="theme">${IconThemes}</button>`
    : `<button class="u2u-nav-button u2u-nav-button--active" data-content="">${IconThemes}</button>
      <div class="u2u-nav-popup">
        <div class="u2u-nav-popup-content">
          <h2 class="u2u-nav-popup-title">${IconThemes} <span>Theme</span></h2>
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
            <h4>Tags</h4>
            <ul>
              <li>
                <label>
                  <input type="radio" name="users" value="light" />
                  <span>Dwight Schrute</span>
                </label>
              </li>
              <li>
                <label>
                  <input type="radio" name="users" value="light" />
                  <span>Dwight S.</span>
                </label>
              </li>
              <li>
                <label>
                  <input type="radio" name="users" value="light" />
                  <span>Dwight</span>
                </label>
              </li>
              <li>
                <label>
                  <input type="radio" name="users" value="light" />
                  <span>D. Schrute</span>
                </label>
              </li>
            </ul>
          </div>
          <div>
            <h4>Other</h4>
            <ul>
              <li>
                <label>
                  <input type="checkbox" name="avatar" />
                  <span>show avatars</span>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" name="avatar" />
                  <span>capitalize only the first letters</span>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>`}
    </div>`;
};

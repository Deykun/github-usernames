# Usernames to names - GitHub

Replace the username with the actual name of the user from their profile. This is useful if you work in an organization where usernames are ambiguous.

## How to install?
1. Install https://www.tampermonkey.net/
2. Go to https://raw.githubusercontent.com/Deykun/github-usernames/main/public/github-usernames.user-srcipt.js

### Development

#### One-time setup
1. Install `src/user-script/dev.user-srcipt.js`.
2. In the "Settings" tab of Tampermonkey, check the box for waiting on update.
3. Provide the address `http://localhost:1234/server.user-script.js`.
4. Install dependecies `npm ci`

#### Using the script
1. Run `npm run dev-us` in one terminal - It builds the script from base files and watches changes
2. Run `npm run dev-us-server` in another terminal - serves the dev script as a dependency
3. [make changes to scripts]
4. On the script page, in the submenu "Tools" > "Check script update availability".
5. F5 (refresh).
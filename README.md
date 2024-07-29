# Show user profile names instead of usernames on GitHub

## Why?

In many organizations with company user accounts, the username is not easily associated with actual persons. Instead of `@JimHelper` 🙂 and `@MichaelScott` 😅, you see `@dundermifflin_302512` 🤖 and `@dundermifflin_302513` 🤖 in pull requests and comments, which makes communication harder.

Example:
https://github.com/orgs/community/discussions/61959

### The solution

The script available here swaps usernames with preferred names from profiles ex. Jim Helper, Jim H. (if available). It allows you to set custom names for picked users and limit these options only to users with specific patterns in their usernames. For instance, `dundermifflin` would swap names only for this organization

## Instalation

1. Install https://www.tampermonkey.net/ - It is a very popular browser extension that allows you to add custom scripts to selected domains.
  - In our case, you will add a script to github.com.
  - You can check the code if you are worried about security: it doesn't touch tokens at all.
2. Go to https://deykun.github.io/github-usernames/github-usernames.user.js

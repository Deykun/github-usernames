import chalk from 'chalk'
import fs from 'fs';

console.log(chalk.green("Building..."));

const template = fs.readFileSync(`./src/template.js`, 'utf-8')


console.log(chalk.green("Saving..."));;

fs.writeFileSync('./github-usernames-to-names.user-srcipt.js', template);
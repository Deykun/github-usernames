import chalk from 'chalk'
import fs from 'fs';
import scriptPackage from '../package.json'

console.log()
console.log(chalk.green("Building..."));
console.log()

let template = fs.readFileSync(`./src/user-script/template.js`, 'utf-8')
const partPaths = fs.readdirSync('./src/user-script/parts');

partPaths.forEach((path) => {
  const partImportInTemplate = `/* import @/${path} */`
      
  if (template.includes(partImportInTemplate)) {
    let content = fs.readFileSync(`./src/user-script/parts/${path}`, 'utf8');

    // Export are removed from user-script
    content = content.replace(/export const/g, 'const');

    // Eslint comments are removed from user-scripts
    [
      '/* eslint-disable no-undef */',
  ].forEach((eslintComment) => {
    content = content.replaceAll(eslintComment, '');
  });

    template = template.replace(partImportInTemplate, content);
    console.log(` - @/${chalk.blue(path)} was imported`);;
  } else {
    if (!path.includes('test.js')){
      console.log(` - @/${chalk.blue(path)} was ${chalk.red("skipped")}`);;
    }
  }
})

template = template.replaceAll('SCRIPT_VERSION', `${scriptPackage?.version}`);
console.log()
console.log(chalk.green("Saving..."));
console.log()

fs.writeFileSync('./public/github-usernames.user.js', template);
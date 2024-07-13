import chalk from 'chalk'
import fs from 'fs';


console.log()
console.log(chalk.green("Building..."));
console.log()

let template = fs.readFileSync(`./src/template.js`, 'utf-8')
const partPaths = fs.readdirSync('./src/parts');

partPaths.forEach((path) => {
  const partImportInTemplate = `/* import @/${path} */`
      
  if (template.includes(partImportInTemplate)) {
    const content = fs.readFileSync(`./src/parts/${path}`, 'utf8');

    const contentWithoutExport = content.replace(/export const/g, 'const');

    template = template.replace(partImportInTemplate, contentWithoutExport);
    console.log(` - @/${path} was imported`);;
  } else {
    console.log(` - @/${path} was skipped`);;
  }
})

console.log()
console.log(chalk.green("Saving..."));
console.log()

fs.writeFileSync('./github-usernames-to-names.user-srcipt.js', template);
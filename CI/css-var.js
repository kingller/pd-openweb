const path = require('path');
const generateCssVariables = require('../../pandora-css-variables/index');

const pandoraPath = path.join(process.cwd(), './node_modules/pandora');

generateCssVariables({
  varFile: path.join(pandoraPath, './src/css/variables.less'),
  globalVarFile: path.join(pandoraPath, './src/css/global-variables.less'),
  outputFilePath: path.join(process.cwd(), './dest/theme2.less'),
});

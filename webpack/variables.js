const path = require('path');

exports.srcDirectory = path.join(__dirname, '..');

exports.excludedPatterns = [/node_modules/];
exports.cssModulesPattern = /\.module\.s?css$/;

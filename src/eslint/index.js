import generator from "yeoman-generator";

import {addIgnorePatternsToFile} from "../app/editor/ignoreFile";
import {mergePackage} from "../app/editor/package";

const devDependencies = {
  "eslint": "^1",
  "babel-eslint": "^4",

  "eslint-plugin-babel": "^3",
  "eslint-plugin-import": "^0",

  "eslint-config-import": "^0",
};

module.exports = generator.Base.extend({
  constructor() {
    generator.Base.apply(this, arguments);
  },

  configuring() {
    this.fs.copy(this.templatePath("eslintrc"), this.destinationPath(".eslintrc"));

    mergePackage(this.fs, this.destinationPath("package.json"), {
      scripts: {
        "check": "eslint src test",
        "watch:check": 'watch "npm run check --silent"',
      },
      devDependencies,
    });

    addIgnorePatternsToFile(this.fs, this.destinationPath(".npmignore"), [
      "/.eslintrc",
    ]);
  },

  install() {
    this.npmInstall();
  },
});

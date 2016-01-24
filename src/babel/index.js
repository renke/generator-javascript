import generator from "yeoman-generator";

import {addIgnorePatternsToFile} from "../app/editor/ignoreFile";
import {mergePackage} from "../app/editor/package";

const devDependencies = {
  "babel-cli": "^6",
  "babel-register": "^6",

  "babel-preset-es2015": "^6",
  "babel-preset-stage-0": "^6",
  "babel-preset-react": "^6",

  "babel-plugin-transform-decorators-legacy": "^1",
};

module.exports = generator.Base.extend({
  constructor() {
    generator.Base.apply(this, arguments);
  },

  configuring() {
    this.fs.copy(this.templatePath("babelrc"), this.destinationPath(".babelrc"));
    
    mergePackage(this.fs, this.destinationPath("package.json"), {
      scripts: {
        "prepublish": "npm run compile --production",
        "compile": "babel src --out-dir lib",
        "watch:compile": "babel src --out-dir lib --watch",
      },
      devDependencies,
    });

    addIgnorePatternsToFile(this.fs, this.destinationPath(".npmignore"), [
      "/.babelrc",
    ]);
  },
});

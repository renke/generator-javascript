import generator from "yeoman-generator";

import {addIgnorePatternsToFile} from "../app/editor/ignoreFile";
import {mergeJSON} from "../app/editor/json";
import {mergePackage} from "../app/editor/package";

const devDependencies = {
  "eslint-plugin-mocha": "^2.0.0",
};

module.exports = generator.Base.extend({
  constructor() {
    generator.Base.apply(this, arguments);
  },

  configuring() {
    this::mergeJSON(this.destinationPath("test/.eslintrc"), {
      extends: [
        "../.eslintrc",
        "renke/config/mocha",
      ],
    });

    this::mergePackage( {
      devDependencies,
    });

    addIgnorePatternsToFile(this.fs, this.destinationPath(".npmignore"), [
      "/test/.eslintrc",
    ]);
  },

  install() {
    this.npmInstall();
  },
});

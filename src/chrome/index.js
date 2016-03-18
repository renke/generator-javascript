import generator from "yeoman-generator";

import {addIgnorePatternsToFile} from "../app/editor/ignoreFile";
import {mergeJSON} from "../app/editor/json";

module.exports = generator.Base.extend({
  constructor() {
    generator.Base.apply(this, arguments);
  },

  configuring() {
    this::mergeJSON(this.destinationPath("test/manifest.json"), {
      extends: [
        "../.eslintrc",
        "renke/config/mocha",
      ],
    });

    addIgnorePatternsToFile(this.fs, this.destinationPath(".npmignore"), [
      "/test/.eslintrc",
    ]);
  },

  install() {
    this.npmInstall();
  },
});

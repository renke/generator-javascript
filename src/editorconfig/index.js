import generator from "yeoman-generator";

import {addIgnorePatternsToFile} from "../app/editor/ignoreFile";

module.exports = generator.Base.extend({
  constructor() {
    generator.Base.apply(this, arguments);
  },

  configuring() {
    this.fs.copy(this.templatePath("editorconfig"), this.destinationPath(".editorconfig"));

    addIgnorePatternsToFile(this.fs, this.destinationPath(".npmignore"), [
      "/.editorconfig",
    ]);
  },
});

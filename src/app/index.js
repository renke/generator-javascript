import generator from "yeoman-generator";

import {addIgnorePatternsToFile} from "../app/editor/ignoreFile";
import {mergePackage} from "../app/editor/package";
import {GENERATOR_NAME}  from "../app/names";

module.exports = generator.Base.extend({
  constructor() {
    generator.Base.apply(this, arguments);
  },

  configuring() {
    this::mergePackage( {
      scripts: {
        "generate": `yo ${GENERATOR_NAME}`,
      },

      devDependencies: {
        // FIXME: Packages are too big
        // TODO: Version number
        // "yo": "*",
        // [GENERATOR_PACKAGE_NAME]: "*",
      },
    });

    addIgnorePatternsToFile(this.fs, this.destinationPath(".npmignore"), [
      "/.yo-rc.json",
    ]);

    this.config.save();
  },

  install() {
    this.npmInstall();
  },
});

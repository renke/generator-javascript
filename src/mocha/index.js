import * as q from "../app/questions";

import generator from "yeoman-generator";
import {kebabCase, camelCase} from "lodash";

import Interviewer from "../app/Interviewer";
import {addIgnorePatternsToFile} from "../app/editor/ignoreFile";
import {mergePackage} from "../app/editor/package";

const devDependencies = {
  "mocha": "^2",
  "chai": "^3",
  "sinon": "^1",
};

module.exports = generator.Base.extend({
  constructor() {
    generator.Base.apply(this, arguments);

    this.answers = {};
  },

  prompting() {
    const interviewer = new Interviewer(this.options);

    interviewer.ask("libraryName", q.libraryName(this.destinationRoot()));

    interviewer.prompt(this).then(answers => {
      this.answers = answers;
    });
  },

  configuring() {
    const {libraryName} = this.answers;

    const packageName = kebabCase(libraryName);
    const moduleName = camelCase(libraryName);

    this.fs.copyTpl(
      this.templatePath("test/index.js.ejs"),
      this.destinationPath("test/index.js"),
      {
        packageName,
        moduleName,
      },
    );

    this::mergePackage( {
      scripts: {
        "test": "mocha --compilers js:babel-register",
        "watch:test": "mocha --compilers js:babel-register --watch",
      },
      devDependencies,
    });

    addIgnorePatternsToFile(this.fs, this.destinationPath(".npmignore"), [
      "/test",
    ]);
  },

  install() {
    this.npmInstall();
  },
});

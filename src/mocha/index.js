import * as q from "../app/questions";

import generator from "yeoman-generator";
import {kebabCase, camelCase} from "lodash";

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
    const {libraryName} = this.options;

    const questions = [];

    if (!libraryName) {
      questions.push(q.libraryName(this.destinationRoot()));
    } else {
      this.answers.libraryName = libraryName;
    }

    if (questions.length > 0) {
      const done = this.async();

      this.prompt(questions, answers => {
        this.answers = answers;
        done();
      });
    }
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

    mergePackage(this.fs, this.destinationPath("package.json"), {
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

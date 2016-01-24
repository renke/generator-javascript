import * as q from "../app/questions";

import generator from "yeoman-generator";
import {kebabCase, camelCase} from "lodash";

import {addIgnorePatternsToFile} from "../app/editor/ignoreFile";
import {mergePackage} from "../app/editor/package";

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
      this.templatePath("src/index.js.ejs"),
      this.destinationPath("src/index.js"),
      {
        packageName,
        moduleName,
      },
    );

    mergePackage(this.fs, this.destinationPath("package.json"), {main: "lib"});

    addIgnorePatternsToFile(this.fs, this.destinationPath(".gitignore"), [
      "/lib",
    ]);

    addIgnorePatternsToFile(this.fs, this.destinationPath(".npmignore"), [
      "/src",
    ]);
  },

  install() {
    this.npmInstall();
  },
});

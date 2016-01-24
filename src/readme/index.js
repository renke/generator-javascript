import generator from "yeoman-generator";
import {kebabCase} from "lodash";

import * as q from "../app/questions";

module.exports = generator.Base.extend({
  constructor() {
    generator.Base.apply(this, arguments);

    this.answers = {};
  },

  prompting() {
    const {libraryName} = this.options;

    if (!libraryName) {
      const questions = [
        q.libraryName(this.destinationRoot()),
      ];

      const done = this.async();

      this.prompt(questions, answers => {
        this.answers = answers;
        done();
      });
    } else {
      this.answers.libraryName = libraryName;
    }
  },

  configuring() {
    const {libraryName} = this.answers;
    const packageName = kebabCase(libraryName);

    this.fs.copyTpl(
      this.templatePath("README.md.ejs"),
      this.destinationPath("README.md"),
      {
        libraryName,
        packageName,
      },
    );


  },
});

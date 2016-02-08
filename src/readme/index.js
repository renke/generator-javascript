import * as q from "../app/questions";

import generator from "yeoman-generator";
import {kebabCase} from "lodash";

import Interviewer from "../app/Interviewer";

module.exports = generator.Base.extend({
  constructor() {
    generator.Base.apply(this, arguments);
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

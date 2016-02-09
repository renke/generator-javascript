import * as q from "../app/questions";

import generator from "yeoman-generator";

import Interviewer from "../app/Interviewer";
import {mergeData} from "../app/editor/json";

module.exports = generator.Base.extend({
  constructor() {
    generator.Base.apply(this, arguments);
  },

  prompting() {
    const interviewer = new Interviewer(this.options);

    interviewer.ask("authorName", q.authorName(this.user.git.name()));

    interviewer.prompt(this).then(answers => {
      this.answers = answers;
    });
  },

  configuring() {
    const {authorName} = this.answers;

    this.fs.copyTpl(
      this.templatePath("LICENSE.ejs"),
      this.destinationPath("LICENSE"),
      {
        year: new Date().getFullYear(),
        fullname: authorName,
      },
    );

    this::mergeData(this.destinationPath("package.json"), {
      license: "ISC",
    });
  },
});

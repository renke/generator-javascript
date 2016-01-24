import * as q from "../app/questions";

import generator from "yeoman-generator";

import {mergePackage} from "../app/editor/package";

module.exports = generator.Base.extend({
  constructor() {
    generator.Base.apply(this, arguments);

    this.answers = {};
  },

  prompting() {
    const {authorName} = this.options;

    const questions = [];

    if (!authorName) {
      questions.push(q.authorName(this.user.git.name()));
    } else {
      this.answers.authorName = authorName;
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
    const {authorName} = this.answers;

    this.fs.copyTpl(
      this.templatePath("LICENSE.ejs"),
      this.destinationPath("LICENSE"),
      {
        year: new Date().getFullYear(),
        fullname: authorName,
      },
    );

    const packageData = {
      license: "ISC",
    };

    mergePackage(this.fs, this.destinationPath("package.json"), packageData);
  },
});

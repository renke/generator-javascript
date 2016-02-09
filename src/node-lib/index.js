import * as q from "../app/questions";

import generator from "yeoman-generator";

import useGenerator from "../app/useGenerator";
import Interviewer from "../app/Interviewer";

const otherGenerators = [
  "app",
  "editorconfig",
  "eslint",
  "git",
  "github",
  "license",
  "mocha",
  "npm",
  "readme",
];

module.exports = generator.Base.extend({
  constructor() {
    generator.Base.apply(this, arguments);
  },

  prompting() {
    const interviewer = new Interviewer(this.options);

    interviewer.ask("libraryName", q.libraryName(this.destinationRoot()));

    interviewer.ask("authorName", q.authorName(this.user.git.name()));
    interviewer.ask("authorEmail", q.authorEmail(this.user.git.email()));

    interviewer.prompt(this).then(answers => {
      this.answers = answers;

      otherGenerators.forEach(name => {
        this::useGenerator(name, answers);
      });

      this::useGenerator("babel", {
        ...answers,
        sourceDirectory: "src",
        targetDirectory: "lib",
        scriptSuffix: "",
      });
    });
  },
});

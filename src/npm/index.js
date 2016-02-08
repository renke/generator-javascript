import * as q from "../app/questions";

import generator from "yeoman-generator";
import {kebabCase, merge} from "lodash";

import Interviewer from "../app/Interviewer";
import {addIgnorePatternsToFile} from "../app/editor/ignoreFile";

module.exports = generator.Base.extend({
  constructor() {
    generator.Base.apply(this, arguments);

    this.answers = {};
  },

  prompting() {
    const interviewer = new Interviewer(this.options);

    interviewer.ask("libraryName", q.libraryName(this.destinationRoot()));
    interviewer.ask("authorName", q.authorName(this.user.git.name()));
    interviewer.ask("authorEmail", q.authorEmail(this.user.git.email()));

    interviewer.prompt(this).then(answers => {
      this.answers = answers;
    });
  },

  configuring() {
    const {libraryName, authorName, authorEmail} = this.answers;

    const packageName = kebabCase(libraryName);

    const oldPackageData = this.fs.readJSON(this.destinationPath("package.json"), {});

    const packageData = {
      name: packageName,
      version: "0.0.0",
      description: libraryName,

      private: true,

      author: {
        name: authorName,
        email: authorEmail,
      },
    };

    const newPackageData = merge(oldPackageData, packageData);

    this.fs.writeJSON(this.destinationPath("package.json"), newPackageData);

    addIgnorePatternsToFile(this.fs, this.destinationPath(".npmignore"), [
      "/.npmignore",
      `${libraryName}-*.tgz`,
    ]);

    addIgnorePatternsToFile(this.fs, this.destinationPath(".gitignore"), [
      "/node_modules",
      "/npm-debug.log",
      `${libraryName}-*.tgz`,
    ]);
  },

  install() {
    this.npmInstall();
  },
});

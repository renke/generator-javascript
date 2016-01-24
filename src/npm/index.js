import * as q from "../app/questions";

import generator from "yeoman-generator";
import {kebabCase, merge} from "lodash";

import {addIgnorePatternsToFile} from "../app/editor/ignoreFile";

module.exports = generator.Base.extend({
  constructor() {
    generator.Base.apply(this, arguments);

    this.answers = {};
  },

  prompting() {
    const {libraryName, authorName, authorEmail} = this.options;

    const questions = [];

    if (!libraryName) {
      questions.push(q.libraryName(this.destinationRoot()));
    } else {
      this.answers.libraryName = libraryName;
    }

    if (!authorName) {
      questions.push(q.authorName(this.user.git.name()));
    } else {
      this.answers.authorName = authorName;
    }

    if (!authorEmail) {
      questions.push(q.authorEmail(this.user.git.email()));
    } else {
      this.answers.authorEmail = authorEmail;
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
    ]);

    addIgnorePatternsToFile(this.fs, this.destinationPath(".gitignore"), [
      "/node_modules",
      "/npm-debug.log",
    ]);
  },

  install() {
    this.npmInstall();
  },
});

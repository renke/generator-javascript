import * as q from "./questions";

import generator from "yeoman-generator";

import Interviewer from "../app/Interviewer";
import {addIgnorePatternsToFile} from "../app/editor/ignoreFile";
import {mergePackage} from "../app/editor/package";

const GENERATOR_NAME = "@renke/node-lib";
const GENERATOR_PACKAGE_NAME = "@renke/generator-node-lib";

const subgenerators = [
  "babel",
  "editorconfig",
  "eslint",
  "git",
  "index",
  "license",
  "mocha",
  "npm",
  "readme",
];

module.exports = generator.Base.extend({
  constructor() {
    generator.Base.apply(this, arguments);
  },

  _subgenerator(name, options) {
    this.composeWith(GENERATOR_NAME, {
      options,
    }, {
      local: require.resolve(`../${name}`),
    });
  },

  prompting() {
    const interviewer = new Interviewer(this.options);

    interviewer.ask("libraryName", q.libraryName(this.destinationRoot()));
    interviewer.ask("authorName", q.authorName(this.user.git.name()));
    interviewer.ask("authorEmail", q.authorEmail(this.user.git.email()));

    interviewer.prompt(this).then(answers => {
      this.answers = answers;

      // Compose with subgenerators
      subgenerators.forEach(name => {
        this._subgenerator(name, answers);
      });
    });
  },

  configuring() {
    mergePackage(this.fs, this.destinationPath("package.json"), {
      scripts: {
        "generate": "yo",
      },

      devDependencies: {
        "yo": "*", // TODO: Version number
        [GENERATOR_PACKAGE_NAME]: "*", // TODO: Version number
      },
    });

    addIgnorePatternsToFile(this.fs, this.destinationPath(".npmignore"), [
      "/.yo-rc.json",
    ]);

    this.config.save();
  },
});

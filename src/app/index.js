import * as q from "./questions";

import generator from "yeoman-generator";

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

    this.answers = {};
  },

  _subgenerator(name, options) {
    this.composeWith(GENERATOR_NAME, {
      options,
    }, {
      local: require.resolve(`../${name}`),
    });
  },

  prompting() {
    const done = this.async();

    const questions = [
      q.libraryName(this.destinationRoot()),

      q.authorName(this.user.git.name()),
      q.authorEmail(this.user.git.email()),
    ];

    this.prompt(questions, answers => {
      this.answers = answers;

      // Compose with subgenerators
      subgenerators.forEach(name => {
        this._subgenerator(name, answers);
      });

      done();
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

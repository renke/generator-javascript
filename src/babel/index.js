import generator from "yeoman-generator";

import Interviewer from "../app/Interviewer";
import {addIgnorePatternsToFile} from "../app/editor/ignoreFile";
import {mergeJSON, BABEL_CONFIG_ORDER} from "../app/editor/json";
import {mergePackage} from "../app/editor/package";

const devDependencies = {
  "babel-cli": "^6",
  "babel-register": "^6",

  "babel-preset-es2015": "^6",
  "babel-preset-stage-0": "^6",
  "babel-preset-react": "^6",

  "babel-plugin-transform-decorators-legacy": "^1",
};

module.exports = generator.Base.extend({
  constructor() {
    generator.Base.apply(this, arguments);
  },

  prompting() {
    const interviewer = new Interviewer(this.options);

    interviewer.prompt(this).then(answers => {
      this.answers = answers;
    });
  },

  configuring() {
    this::mergePackage({
      devDependencies,
    });

    this::mergeJSON(this.destinationPath(".babelrc"), {
      "presets": [
        "es2015",
        "stage-0",
      ],

      "plugins": [
        "transform-decorators-legacy",
      ],
    }, BABEL_CONFIG_ORDER);

    addIgnorePatternsToFile(this.fs, this.destinationPath(".npmignore"), [
      "/.babelrc",
    ]);
  },

  install() {
    this.npmInstall();
  },
});

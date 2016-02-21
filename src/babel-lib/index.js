import * as q from "../app/questions";

import generator from "yeoman-generator";

import Interviewer from "../app/Interviewer";
import {mergeJSON, BABEL_CONFIG_ORDER} from "../app/editor/json";
import {mergePackage} from "../app/editor/package";

const devDependencies = {
  "babel-plugin-transform-runtime": "^6",
  "babel-plugin-add-module-exports": "^0",
};

const dependencies = {
  "babel-runtime": "^6",
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
      dependencies,
    });

    this::mergeJSON(this.destinationPath(".babelrc"), {
      "presets": [
        "es2015",
        "stage-0",
      ],

      "plugins": [
        "add-module-exports",
        "transform-decorators-legacy",
        "transform-runtime",
      ],
    }, BABEL_CONFIG_ORDER);
  },

  install() {
    this.npmInstall();
  },
});

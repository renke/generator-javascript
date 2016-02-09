import * as q from "../app/questions";

import generator from "yeoman-generator";
import {kebabCase, camelCase} from "lodash";

import Interviewer from "../app/Interviewer";
import {mergePackage} from "../app/editor/package";
import {mergeData} from "../app/editor/json";

const devDependencies = {
  "react": "^0",
  "react-dom": "^0",
  "babel-preset-react": "^6",

  "babel-plugin-react-transform": "^2",

  "react-transform-hmr": "^0",

  "react-transform-catch-errors": "^1",
  "redbox-react": "^1",
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
    mergePackage(this.fs, this.destinationPath("package.json"), {
      devDependencies,
    });

    this::mergeData(this.destinationPath(".babelrc"), {
      // TODO: "Merge" arrays by concat()
      presets: [
        "es2015",
        "stage-0",
        "react",
      ],

      // TODO: Make is a little prettier
      env: { development: { plugins: [[ "react-transform", { "transforms": [
        {
          "transform": "react-transform-hmr",
          "imports": ["react"],
          "locals": ["module"],
        },
        {
          "transform": "react-transform-catch-errors",
          "imports": ["react", "redbox-react"],
        },
      ]}]]}},
    });
  },

  install() {
    this.npmInstall();
  },
});

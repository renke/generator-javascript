import generator from "yeoman-generator";

import Interviewer from "../app/Interviewer";
import {mergeJSON, BABEL_CONFIG_ORDER} from "../app/editor/json";
import {mergePackage} from "../app/editor/package";

const devDependencies = {
  "babel-preset-react": "^6",

  "babel-plugin-react-transform": "^2",

  "react-transform-hmr": "^0",

  "react-transform-catch-errors": "^1",
  "redbox-react": "^1",
};

const peerDependencies = {
  "react": "^0",
  "react-dom": "^0",
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
      peerDependencies,
    });

    this::mergeJSON(this.destinationPath(".babelrc"), {
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
    }, BABEL_CONFIG_ORDER);
  },

  install() {
    this.npmInstall();
  },
});

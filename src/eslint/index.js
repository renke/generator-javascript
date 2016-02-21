import generator from "yeoman-generator";

import Interviewer from "../app/Interviewer";
import {addIgnorePatternsToFile} from "../app/editor/ignoreFile";
import {mergeJSON} from "../app/editor/json";
import {mergePackage} from "../app/editor/package";

const CONFIG_NAMES = [
  "node-lib",
  "node-app",
  "browser-lib",
  "browser-app",
  "react-lib",
  "react-app",
];

const devDependencies = {
  "eslint": "^2",
  "babel-eslint": "^4",

  "eslint-plugin-babel": "^3",
  "eslint-plugin-import": "1.0.0-beta.0",

  "eslint-config-renke": "^0",
};

const configDependencies = {
  "react-lib": {
    "eslint-plugin-react": "^4.0.0",
  },

  "react-app": {
    "eslint-plugin-react": "^4.0.0",
  },
};

function eslintConfigName() {
  return {
    type: "list",
    name: "eslintConfigName",
    message: "ESLint config name",
    choices: CONFIG_NAMES,
  };
}

module.exports = generator.Base.extend({
  constructor() {
    generator.Base.apply(this, arguments);
  },

  prompting() {
    const interviewer = new Interviewer(this.options);

    interviewer.ask("eslintConfigName", eslintConfigName());

    interviewer.prompt(this).then(answers => {
      this.answers = answers;
    });
  },

  configuring() {
    const {eslintConfigName} = this.answers;

    this::mergeJSON(this.destinationPath(".eslintrc"), {
      extends: [
        `renke/config/${eslintConfigName}`,
      ],
    });

    this::mergePackage( {
      scripts: {
        "check": "eslint src test",
        "watch:check": 'watch "npm run check --silent"',
      },

      devDependencies: {
        ...devDependencies,
        ...(configDependencies[eslintConfigName] || {}),
      },
    });

    addIgnorePatternsToFile(this.fs, this.destinationPath(".npmignore"), [
      "/.eslintrc",
    ]);
  },

  install() {
    this.npmInstall();
  },
});

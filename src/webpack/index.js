import * as q from "../app/questions";

import generator from "yeoman-generator";

import makeScriptName from "../app/makeScriptName";
import Interviewer from "../app/Interviewer";
import {addIgnorePatternsToFile} from "../app/editor/ignoreFile";
import {mergePackage} from "../app/editor/package";

const devDependencies = {
  "webpack": "^1",

  "babel-loader": "^6",
  "file-loader": "^0",

  "express": "^4",
  "webpack-dev-middleware": "^1",
  "webpack-hot-middleware": "^2",
};

const NAME = "Webpack";

module.exports = generator.Base.extend({
  constructor() {
    generator.Base.apply(this, arguments);
  },

  prompting() {
    const interviewer = new Interviewer(this.options);

    interviewer.ask("libraryName", q.libraryName(this.destinationRoot()));
    interviewer.ask("sourceDirectory", q.sourceDirectory(NAME));
    interviewer.ask("targetDirectory", q.targetDirectory(NAME));
    interviewer.ask("scriptSuffix", q.scriptSuffix(NAME));

    interviewer.prompt(this).then(answers => {
      this.answers = answers;
    });
  },

  configuring() {
    const {libraryName, sourceDirectory, targetDirectory, scriptSuffix} = this.answers;

    this.fs.copyTpl(
      this.templatePath("webpack.config.babel.js.ejs"),
      this.destinationPath("webpack.config.babel.js"),
      {
        sourceDirectory,
        targetDirectory,
      }
    );

    this.fs.copyTpl(
      this.templatePath("server.js.ejs"),
      this.destinationPath("server.js"),
    );

    this.fs.copyTpl(
      this.templatePath("index.js.ejs"),
      this.destinationPath(sourceDirectory, "index.js"),
    );

    this.fs.copyTpl(
      this.templatePath("index.html.ejs"),
      this.destinationPath(sourceDirectory, "index.html"),
      {
        libraryName,
      }
    );

    mergePackage(this.fs, this.destinationPath("package.json"), {
      scripts: {
        // TODO: Prepublish?!
        [makeScriptName("start", scriptSuffix)]: "babel-node server.js",
        [makeScriptName("build", scriptSuffix)]: "webpack",
        [makeScriptName("watch:build", scriptSuffix)]: "webpack --watch",
      },
      devDependencies,
    });

    addIgnorePatternsToFile(this.fs, this.destinationPath(".npmignore"), [
      "webpack.config.babel.js",
    ]);
  },

  install() {
    this.npmInstall();
  },
});

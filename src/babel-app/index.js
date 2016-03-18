import * as q from "../app/questions";

import generator from "yeoman-generator";
import {kebabCase, camelCase} from "lodash";

import makeScriptName from "../app/makeScriptName";
import Interviewer from "../app/Interviewer";
import {addIgnorePatternsToFile} from "../app/editor/ignoreFile";
import {addSequentialTask} from "../app/editor/npmScript";
import {mergePackage} from "../app/editor/package";

const NAME = "Babel";

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

    const packageName = kebabCase(libraryName);
    const moduleName = camelCase(libraryName);

    this::addSequentialTask("prepublish", `npm run --production ${makeScriptName("build", scriptSuffix)}`);

    this::mergePackage({
      main: targetDirectory,

      scripts: {
        [makeScriptName("build", scriptSuffix)]: `babel ${sourceDirectory} --out-dir ${targetDirectory}`,
        [makeScriptName("watch:build", scriptSuffix)]: `babel ${sourceDirectory} --out-dir ${targetDirectory} --watch`,
      },
    });

    this.fs.copyTpl(
      this.templatePath("index.js.ejs"),
      this.destinationPath("src/index.js"),
      {
        packageName,
        moduleName,
      },
    );

    addIgnorePatternsToFile(this.fs, this.destinationPath(".npmignore"), [
      `/${sourceDirectory}`,
    ]);

    addIgnorePatternsToFile(this.fs, this.destinationPath(".gitignore"), [
      `/${targetDirectory}`,
    ]);
  },

  install() {
    this.npmInstall();
  },
});

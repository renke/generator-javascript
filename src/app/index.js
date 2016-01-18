import generator from "yeoman-generator";
import {kebabCase, camelCase} from "lodash";
import {basename} from "path";

module.exports = generator.Base.extend({
  init() {
    this.answers = {};
  },

  prompting() {
    const done = this.async();

    const questions = [
      {
        type: "input",
        name: "libraryName",
        message: "Library name",
        validate(libraryName) {
          return libraryName.length !== 0;
        },
        default: basename(this.destinationRoot()),
      },
      {
        type: "input",
        name: "authorName",
        message: "Your name",
        default: this.user.git.name(),
      },
      {
        type: "input",
        name: "authorEmail",
        message: "Your email",
        default: this.user.git.email(),
      },
    ];

    this.prompt(questions, answers => {
      this.answers = answers;
      done();
    });
  },

  configuring() {
    const {libraryName} = this.answers;
    const {authorName, authorEmail} = this.answers;

    const packageName = kebabCase(libraryName);
    const moduleName = camelCase(libraryName);

    const packageData = {
      name: packageName,
      version: "0.0.0",
      description: libraryName,

      private: true,
      main: "lib",

      scripts: {
        "prepublish": "npm run compile --production",

        "compile": "babel src --out-dir lib",
        "watch:compile": "babel src --out-dir lib --watch",

        "test": "mocha --compilers js:babel-register",
        "watch:test": "mocha --compilers js:babel-register --watch",

        "check": "eslint src test",
        "watch:check": 'watch "npm run check --silent"',
      },

      author: {
        name: authorName,
        email: authorEmail,
      },

      license: "ISC",

      devDependencies,
    };

    this.fs.writeJSON(this.destinationPath("package.json"), packageData);

    this.fs.copy(this.templatePath("babelrc"), this.destinationPath(".babelrc"));
    this.fs.copy(this.templatePath("editorconfig"), this.destinationPath(".editorconfig"));
    this.fs.copy(this.templatePath("eslintrc"), this.destinationPath(".eslintrc"));
    this.fs.copy(this.templatePath("gitignore"), this.destinationPath(".gitignore"));
    this.fs.copy(this.templatePath("npmignore"), this.destinationPath(".npmignore"));

    this.fs.copyTpl(
      this.templatePath("README.md.ejs"),
      this.destinationPath("README.md"),
      {
        libraryName,
        packageName,
      },
    );

    this.fs.copyTpl(
      this.templatePath("LICENSE.ejs"),
      this.destinationPath("LICENSE"),
      {
        year: new Date().getFullYear(),
        fullname: this.answers.authorName,
      },
    );

    this.fs.copyTpl(
      this.templatePath("src/index.js.ejs"),
      this.destinationPath("src/index.js"),
      {
        packageName,
        moduleName,
      },
    );

    this.fs.copyTpl(
      this.templatePath("test/index.js.ejs"),
      this.destinationPath("test/index.js"),
      {
        packageName,
        moduleName,
      },
    );

    this.config.save();
  },

  install() {
    this.npmInstall();
  },

  end() {
    this.spawnCommandSync("git", ["init"]);
    this.spawnCommandSync("git", ["commit", "--allow-empty", "-m", "Empty commit"]);
  },
});

const devDependencies = {
  "babel-cli": "^6",
  "babel-register": "^6",

  "babel-preset-es2015": "^6",
  "babel-preset-stage-0": "^6",
  "babel-preset-react": "^6",

  "babel-plugin-transform-decorators-legacy": "^1",

  "eslint": "^1",

  "babel-eslint": "^4",

  "eslint-plugin-babel": "^3",
  "eslint-plugin-import": "^0",

  "eslint-config-import": "^0",

  "mocha": "^2",
  "chai": "^3",
  "sinon": "^1",
};

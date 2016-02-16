import * as q from "../app/questions";

import generator from "yeoman-generator";
import {stat} from "fs";

import Interviewer from "../app/Interviewer";
import {mergeJSON} from "../app/editor/json";

module.exports = generator.Base.extend({
  constructor() {
    generator.Base.apply(this, arguments);
  },

  prompting() {
    const interviewer = new Interviewer(this.options);

    interviewer.ask("libraryName", q.libraryName(this.destinationRoot()));
    // TODO: Use username as default value
    interviewer.ask("githubUsername", q.githubUsername());

    interviewer.prompt(this).then(answers => {
      this.answers = answers;
    });
  },

  configuring() {
    const {libraryName, githubUsername} = this.answers;

    this::mergeJSON(this.destinationPath("package.json"), {
      repository: buildRepositoryName(libraryName, githubUsername),
    });
  },

  end() {
    const {libraryName, githubUsername} = this.answers;

    const done = this.async();

    stat(this.destinationPath(".git"), err => {
      if (err !== null) { // Directory doesn't exist
        this.spawnCommandSync("git", ["init"]);
      }

      const repositoryUrl = buildRepositoryUrl(libraryName, githubUsername);
      this.spawnCommandSync("git", ["remote", "add", "origin", repositoryUrl]);

      done();
    });
  },
});

function buildRepositoryName(libraryName, githubUsername) {
  return `${githubUsername}/${libraryName}`;
}

function buildRepositoryUrl(libraryName, githubUsername) {
  return `git@github.com:${buildRepositoryName(libraryName, githubUsername)}.git`;
}

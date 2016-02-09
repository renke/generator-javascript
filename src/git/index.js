import generator from "yeoman-generator";
import {stat} from "fs";

module.exports = generator.Base.extend({
  constructor() {
    generator.Base.apply(this, arguments);
  },

  end() {
    const done = this.async();

    stat(this.destinationPath(".git"), err => {
      if (err !== null) { // Directory doesn't exist
        this.spawnCommandSync("git", ["init"]);            
        this.spawnCommandSync("git", ["commit", "--allow-empty", "-m", "Empty commit"]);
        this.spawnCommandSync("git", ["add", "."]);
        this.spawnCommandSync("git", ["commit", "-m", "Initial commit"]);
      }

      done();
    });
  },
});

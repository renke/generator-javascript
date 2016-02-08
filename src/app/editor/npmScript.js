import {merge} from "lodash";

export function addSequentialTask(name, task) {
  const packageFilePath = this.destinationPath("package.json");
  const oldPackageData = this.fs.readJSON(packageFilePath, {});

  const oldScripts = oldPackageData.scripts;
  const newScripts = {...oldScripts};

  if (oldScripts && oldScripts[name]) {
    const oldTask = oldScripts[name];

    if (oldTask.includes(task)) {
      return; // Nothing to do really
    }

    newScripts[name] = `${oldTask} && ${task}`;

    // TODO
  } else {
    newScripts[name] = task;
  }

  const newPackageData = merge(oldPackageData, {scripts: newScripts});
  this.fs.writeJSON(packageFilePath, newPackageData);
}

import {merge} from "lodash";

export function mergeData(path, data) {
  const oldData = this.fs.readJSON(path, {});
  const newData = merge(oldData, data);
  this.fs.writeJSON(path, newData);
}

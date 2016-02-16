import sortObjectKeys from "sort-object-keys";
import {merge} from "lodash";

export function mergeJSON(path, data, order=[]) {
  const oldData = this.fs.readJSON(path, {});

  const newData = merge(oldData, data);
  const sortedData = sortObjectKeys(newData, order);

  this.fs.writeJSON(path, sortedData);
}

export const BABEL_CONFIG_ORDER = [
  "presets",
  "plugins",
  "env",
];

import sortPackageJSON from "sort-package-json";
import {merge} from "lodash";

export function mergePackage(packageData) {
  const oldPackageData = this.fs.readJSON(this.destinationPath("package.json"), {});

  const newPackageData = merge(oldPackageData, packageData);
  const sortedPackageData = sortPackageJSON(newPackageData);

  this.fs.writeJSON(this.destinationPath("package.json"), sortedPackageData);
}

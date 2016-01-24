import {merge} from "lodash";

export function mergePackage(fileSystem, packageFilePath, packageData) {
  const oldPackageData = fileSystem.readJSON(packageFilePath, {});
  const newPackageData = merge(oldPackageData, packageData);
  fileSystem.writeJSON(packageFilePath, newPackageData);
}

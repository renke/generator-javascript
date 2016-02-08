import {basename} from "path";

export function libraryName(destinationDirectory) {
  return {
    type: "input",
    name: "libraryName",
    message: "Library name",
    default: basename(destinationDirectory),

    validate(libraryName) {
      return libraryName.length !== 0;
    },
  };
}

export function authorName(defaultValue) {
  return {
    type: "input",
    name: "authorName",
    message: "Your name",
    default: defaultValue,
  };
}

export function authorEmail(defaultValue) {
  return {
    type: "input",
    name: "authorEmail",
    message: "Your email",
    default: defaultValue,
  };
}

export function sourceDirectory(name) {
  return {
    type: "input",
    name: "sourceDirectory",
    message: `${name} source directory`,
    default: "src",

    validate(sourceDirectory) {
      return sourceDirectory.length !== 0;
    },
  };
}

export function targetDirectory(name) {
  return {
    type: "input",
    name: "targetDirectory",
    message: `${name} target directory`,
    default: "lib",

    validate(targetDirectory) {
      return targetDirectory.length !== 0;
    },
  };
}

export function scriptSuffix(name) {
  return {
    type: "input",
    name: "scriptSuffix",
    message: `${name} scripts suffix (as in "build:$suffix")`,
    default: "",
  };
}

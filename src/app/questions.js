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

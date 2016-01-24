import {EOL} from "os";

export function addIgnorePatternsToFile(fileSystem, filePath, patterns) {
  const ignoreFileContent = fileSystem.read(filePath, {defaults: ""});
  const newIgnoreFileContent = addIgnorePatterns(ignoreFileContent, patterns);
  fileSystem.write(filePath, newIgnoreFileContent);
}

export function addIgnorePatterns(ignoreFileContent, patterns) {
  return (ignoreFileContent.trim() + EOL.repeat(2) + patterns.join(EOL)).trim();
}

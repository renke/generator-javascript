import {EOL} from "os";

export function addIgnorePatternsToFile(fileSystem, filePath, patterns) {
  const ignoreFileContent = fileSystem.read(filePath, {defaults: ""});
  const newIgnoreFileContent = addIgnorePatterns(ignoreFileContent, patterns);
  fileSystem.write(filePath, newIgnoreFileContent);
}

export function addIgnorePatterns(ignoreFileContent, patterns) {
  const patternString = patterns.filter(pattern => {
    return !ignoreFileContent.includes(pattern);
  }).join(EOL);

  return (ignoreFileContent.trim() + EOL.repeat(2) + patternString).trim();
}

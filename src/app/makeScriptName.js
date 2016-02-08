export default function makeScriptName(prefix, suffix="") {
  if (suffix === "") {
    return prefix;
  } else {
    return `${prefix}:${suffix}`;
  }
}

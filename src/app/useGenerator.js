import {GENERATOR_NAME} from "./names";

export default function useGenerator(name, options) {
  this.composeWith(GENERATOR_NAME, {
    options,
  }, {
    local: require.resolve(`../${name}`),
  });
}

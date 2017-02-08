import {Environment} from '../environment/environment';


class EnvironmentMap extends Map<string, {new (): Environment}> {}

// TODO(garlicnation): Bring this into polytool.ts
const environments = new EnvironmentMap();
// TODO(garlicnation): Re-enable
// environments.set('reyserve', ReyServe);

/**
 * Builds an environment with the given name.
 */
export function buildEnvironment(name: string): Environment|undefined {
  const E = environments.get(name.toLowerCase());
  if (E)
    return new E();
}
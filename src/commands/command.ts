import {ArgDescriptor} from 'command-line-args';
import {ProjectConfig} from 'prime-project-config';

export type CommandOptions = {
  [name: string]: any
};

export interface Command {
  name: string;
  description: string;
  parseArgs?: Boolean;
  args: ArgDescriptor[];
  run(options: CommandOptions, config: ProjectConfig): Promise<any>;
}
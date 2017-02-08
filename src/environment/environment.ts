import {ProjectBuildOptions, ProjectConfig} from 'prime-project-config';
import {ServerOptions} from 'polyserve/lib/start_server';

export interface Environment {
  serve(options: ServerOptions): Promise<any>;
  build(options: ProjectBuildOptions, config: ProjectConfig): Promise<any>;
}
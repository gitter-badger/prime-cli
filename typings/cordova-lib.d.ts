declare module 'cordova-lib' {
    interface ProjectOptions{
        platforms: Array<String>;
        options: Object;
        verbose?: Boolean;
    }    
    export class cordova {
        public build(options: ProjectOptions): any;
        public run(options: ProjectOptions): any;
        public clean(options: ProjectOptions): any;
        public create(dir:string, optionalId?: string, optionalName?: string, cfg?: any, extEvents?: any): any;
        public emulate(options: ProjectOptions): any;
        public compile(options: ProjectOptions): any;
        public platforms(act: string, platforms?: Array<string>|string, options?: Object): any;
        public plugin(act: string, pluginName: Array<string>|string, options?: Object): any;
        public findProjectRoot(startDir?: string): string;
        static raw: cordova;
    }
    
    
}
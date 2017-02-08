declare module 'cordova-lib' {
    interface ProjectOptions{
        platforms: Array<String>;
        options: Object;
        verbose?: Boolean;
    }
    interface cordova{
        build(options: ProjectOptions): any;
        run(options: ProjectOptions): any;
        clean(options: ProjectOptions): any;
        create(dir:string, optionalId?: string, optionalName?: string, cfg?: any, extEvents?: any): any;
        emulate(options: ProjectOptions): any;
        compile(options: ProjectOptions): any;
        platforms(act: string, platforms?: Array<string>, options?: Object): any;
        plugin(act: string, pluginName: Array<string>, options?: Object): any;
        findProjectRoot(startDir?: string): string;

        raw: cordova;
    }
    export = cordova;
}
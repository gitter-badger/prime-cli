declare module 'yeoman-generator' {
    interface IYeomanGenerator {
        argument(name: string, config: IArgumentConfig): void;
        composeWith(namespace: string, options: any, settings?: IComposeSetting): IYeomanGenerator;
        defaultFor(name: string): void;
        destinationRoot(rootPath?: string): string;
        destinationPath(...path: string[]): string;
        determineAppname(): void;
        getCollisionFilter(): (output: any) => void;
        hookFor(name: string, config: IHookConfig): void;
        option(name: string, config: IYeomanGeneratorOption): void;
        rootGeneratorName(): string;
        run(args?: any): void;
        run(args: any, callback?: Function): void;
        runHooks(callback?: Function): void;
        sourceRoot(rootPath?: string): string;
        templatePath(...path: string[]): string;
        prompt(opt: IPromptOptions | IPromptOptions[], callback: (answers: any) => void): void;
        prompt<T>(opt: IPromptOptions | IPromptOptions[]): PromiseLike<T>;
        npmInstall(packages?: string[] | string, options?: any, cb?: Function): void;
        installDependencies(options?: IInstallDependencyOptions): void;
        spawnCommand(name: string, args?: string[], options?: Object): void;
        spawnCommandSync(name: string, args?: string[], options?: Object): void;
        options: { [key: string]: any };
        fs: IMemFsEditor;
    }

    class YeomanGeneratorBase extends NodeJS.EventEmitter implements IYeomanGenerator {
        argument(name: string, config: IArgumentConfig): void;
        composeWith(namespace: string, options: any, settings?: IComposeSetting): IYeomanGenerator;
        defaultFor(name: string): void;
        destinationRoot(rootPath?: string): string;
        destinationPath(...path: string[]): string;
        determineAppname(): void;
        getCollisionFilter(): (output: any) => void;
        hookFor(name: string, config: IHookConfig): void;
        option(name: string, config?: IYeomanGeneratorOption): void;
        rootGeneratorName(): string;
        run(args?: any): void;
        run(args: any, callback?: Function): void;
        runHooks(callback?: Function): void;
        sourceRoot(rootPath?: string): string;
        templatePath(...path: string[]): string;
        addListener(event: string, listener: Function): this;
        on(event: string, listener: Function): this;
        once(event: string, listener: Function): this;
        removeListener(event: string, listener: Function): this;
        removeAllListeners(event?: string): this;
        setMaxListeners(n: number): this;
        getMaxListeners(): number;
        listeners(event: string): Function[];
        emit(event: string, ...args: any[]): boolean;
        listenerCount(type: string): number;

        async(): any;
        prompt(opt: IPromptOptions | IPromptOptions[], callback: (answers: any) => void): void;
        prompt<T>(opt: IPromptOptions | IPromptOptions[]): PromiseLike<T>;
        log(message: string) : void;
        npmInstall(packages: string[], options?: any, cb?: Function) :void;
        installDependencies(options?: IInstallDependencyOptions): void;
        spawnCommand(name: string, args?: string[], options?: Object): void;
        spawnCommandSync(name: string, args?: string[], options?: Object): void;

        appname: string;
        gruntfile: IGruntFileStatic;
        options: { [key: string]: any };
        fs: IMemFsEditor;
    }

    interface IMemFsEditor {
        read(filepath: string, options?: Object): string;
        readJSON(filepath: string, defaults?: Object): Object;
        write(filepath: string, contents: string): void;
        writeJSON(filepath: string, contents: Object, replacer?: Function, space?: number): void;
        delete(filepath: string, options?: Object): void;
        copy(from: string, to: string, options?: Object): void;
        copyTpl(from: string, to: string, context: Object, options?: Object): void;
        copyTpl(from: string | string[], to: string, context: Object, options?: Object): void;
        move(from: string, to: string, options?: Object): void;
        exists(filepath: string): boolean;
        commit(callback: Function): void;
        commit(filters: any[], callback: Function): void;
    }

    interface IInstallDependencyOptions {
        npm?: boolean;
        bower?: boolean;
        skipMessage?: boolean;
        callback?: Function;
    }

    interface IChoice {
        name: string;
        value: string;
        short?: string;
    }

    interface IPromptOptions{
        type?: string;
        name: string;
        message: string | ((answers: Object) => string);
        choices?: any[] | ((answers: Object) => any);
        default?: string | number | string[] | number[] | ((answers: Object) => (string | number | string[] | number[]));
        validate?: ((input: any) => boolean | string);
        filter?: ((input: any) => any);
        when?: ((answers: Object) => boolean) | boolean;
        store?: boolean;
    }

    interface IGruntFileStatic {
        loadNpmTasks(pluginName: string): void;
        insertConfig(name:string, config:any):void;
        registerTask(name:string, tasks:any):void;
        insertVariable(name:string, value:any):void;
        prependJavaScript(code:string):void;
    }

    interface IArgumentConfig {
        desc: string;
        required?: boolean;
        optional?: boolean;
        type: any;
        defaults?: any;
    }

    interface IComposeSetting {
        local?: string;
        link?: string;
    }

    interface IHookConfig {
        as: string;
        args: any;
        options: any;
    }

    interface IYeomanGeneratorOption {
        alias?: string;
        defaults?: any;
        desc?: string;
        hide?: boolean;
        type?: any;
    }

    interface IQueueProps {
        initializing: () => void;
        prompting?: () => void;
        configuring?: () => void;
        default?: () => void;
        writing: {
            [target: string]: () => void;
        };
        conflicts?: () => void;
        install?: () => void;
        end: () => void;
    }

    interface INamedBase extends IYeomanGenerator {
    }

    interface IBase extends INamedBase {
    }

    interface IAssert {
        file(path: string): void;
        file(paths: string[]): void;
        fileContent(file: string, reg: RegExp): void;

        /** @param {[String, RegExp][]} pairs */
        fileContent(pairs: any[][]): void;

        /** @param {[String, RegExp][]|String[]} pairs */
        files(pairs: any[]): void;

        /**
         * @param {Object} subject
         * @param {Object|Array} methods
         */
        implement(subject: any, methods: any): void;
        noFile(file: string): void;
        noFileContent(file: string, reg: RegExp): void;

        /** @param {[String, RegExp][]} pairs */
        noFileContent(pairs: any[][]): void;

        /**
         * @param {Object} subject
         * @param {Object|Array} methods
         */
        noImplement(subject: any, methods: any): void;

        textEqual(value: string, expected: string): void;
    }

    interface ITestHelper {
        createDummyGenerator(): IYeomanGenerator;
        createGenerator(name: string, dependencies: any[], args: any, options: any): IYeomanGenerator;
        decorate(context: any, method: string, replacement: Function, options: any): void;
        gruntfile(options: any, done: Function): void;
        mockPrompt(generator: IYeomanGenerator, answers: any): void;
        registerDependencies(dependencies: string[]): void;
        restore(): void;

        /** @param {String|Function} generator */
        run(generator: any): IRunContext;
    }

    interface IRunContext {
        async(): Function;
        inDir(dirPath: string): IRunContext;

        /** @param {String|String[]} args */
        withArguments(args: any): IRunContext;
        withGenerators(dependencies: string[]): IRunContext;
        withOptions(options: any): IRunContext;
        withPrompts(answers: any): IRunContext;
    }

    /** @type file file-utils */
    var file: any;
    var assert: IAssert;
    var test: ITestHelper;

    // "generators" is deprecated
    namespace generators {

        export class NamedBase extends YeomanGeneratorBase implements INamedBase {
            constructor(args: string | string[], options: any);
        }

        export class Base extends NamedBase implements IBase {
            static extend(protoProps: IQueueProps, staticProps?: any): IYeomanGenerator;
        }
    }

    class NamedBase extends YeomanGeneratorBase implements INamedBase {
        constructor(args: string | string[], options: any);
    }

    class Base extends NamedBase implements IBase {
        static extend(protoProps: IQueueProps, staticProps?: any): IYeomanGenerator;
    }

    export = Base;
}
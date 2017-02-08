declare module 'command-line-usage' {
  module commandLineUsage {
    interface Section{
      list: Array<any>;
      add(content: Content): void;
      emptyLine (): void;
      header(): void;
      toString(): String;
    }
    interface Content{
      constructor(content: Content): void;
      lines(): any;
    }
    interface ContentSection extends Section{
      constructor(section: Section): void;
    }
    interface OptionList extends Section{
      constructor(): void;
    }
    
  }

  function commandLineUsage(sections: Array<Object>): string;

  export = commandLineUsage;
}
declare module 'sql.js' {
  export default class SQL {
    constructor();
    
    static init(): Promise<SQL>;
    
    exec(sql: string): any[];
    
    prepare(sql: string): {
      bind(values: any[]): void;
      step(): boolean;
      get(): any[];
      reset(): void;
      free(): void;
    };
    
    close(): void;
  }
}

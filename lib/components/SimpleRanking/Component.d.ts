export default function createSimpleRanking(): {
    new (): {
        [x: string]: any;
        get noDragDrop(): boolean;
        shuffleArray<T>(array: T[]): T[];
        init(): void;
        get grandparentRender(): any;
        get grandparentAttach(): any;
        render(): any;
        attach(element: any): any;
        checkValidity(data: any, dirty: any, rowData: any): boolean;
        checkDuplicateRanks(): boolean;
        checkPartialFill(): boolean;
    };
    [x: string]: any;
    schema(...extend: any[]): any;
    get builderInfo(): {
        title: string;
        group: string;
        icon: string;
        weight: number;
        documentation: string;
        showPreview: boolean;
        schema: any;
    };
};

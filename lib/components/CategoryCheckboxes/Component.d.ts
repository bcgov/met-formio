export declare const CATEGORY_CHECKBOXES = "categorycheckboxes";
export default function createCategoryCheckboxes(): {
    new (): {
        [x: string]: any;
        init(): void;
        fetchVcs(): Promise<void>;
        loadCCs(categoryComponents: any): void;
        handleLoadingError(err: any): void;
        get grandparentRender(): any;
        render(): any;
        updateValue(value: any, flags: any): any;
    };
    [x: string]: any;
    schema(...extend: any[]): any;
    get builderInfo(): {
        title: string;
        group: string;
        icon: string;
        weight: number;
        documentation: string;
        schema: any;
    };
};

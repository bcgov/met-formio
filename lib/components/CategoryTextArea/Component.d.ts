export default function createCategoryTextArea(): {
    new (): {
        [x: string]: any;
        init(): void;
        renderElement(value: any, index: any): any;
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

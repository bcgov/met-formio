export default function createSimpleContent(): {
    new (): {
        [x: string]: any;
        render(): string;
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

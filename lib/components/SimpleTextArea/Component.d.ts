export default function createSimpleTextArea(): {
    new (): {
        [x: string]: any;
        attach(element: HTMLElement): any;
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

export default function createSimpleSurvey(): {
    new (): {
        [x: string]: any;
        checkValidity(data: any, dirty: any, rowData: any): any;
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

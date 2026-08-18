declare const _default: ({
    type: string;
    title: any;
    theme: string;
    collapsible: boolean;
    collapsed: boolean;
    key: string;
    weight: any;
    components: any[];
} | {
    type: string;
    title: string;
    key: string;
    theme: string;
    weight: number;
    components: ({
        type: string;
        input: boolean;
        label: string;
        key: string;
        dataSrc: string;
        data: {
            values: {
                label: string;
                value: string;
            }[];
            custom?: undefined;
        };
        valueProperty?: undefined;
    } | {
        type: string;
        input: boolean;
        label: string;
        key: string;
        dataSrc: string;
        valueProperty: string;
        data: {
            custom(context: any): {
                label: string;
                value: any;
            }[];
            values?: undefined;
        };
    } | {
        type: string;
        input: boolean;
        label: string;
        key: string;
        dataSrc?: undefined;
        data?: undefined;
        valueProperty?: undefined;
    })[];
})[];
export default _default;

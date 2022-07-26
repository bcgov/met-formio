declare const _default: {
    key: string;
    components: ({
        key: string;
        ignore: boolean;
    } | {
        weight: number;
        type: string;
        input: boolean;
        key: string;
        label: string;
        tooltip: string;
        customConditional(context: any): boolean;
        defaultValue?: undefined;
        reorder?: undefined;
        components?: undefined;
        ignore?: undefined;
    } | {
        weight: number;
        type: string;
        input: boolean;
        key: string;
        label: string;
        defaultValue: boolean;
        tooltip?: undefined;
        reorder?: undefined;
        components?: undefined;
        ignore?: undefined;
    } | {
        weight: number;
        type: string;
        input: boolean;
        key: string;
        label: string;
        customConditional(context: any): boolean;
        reorder: boolean;
        components: {
            type: string;
            key: string;
            label: string;
            input: boolean;
        }[];
        tooltip?: undefined;
        defaultValue?: undefined;
        ignore?: undefined;
    } | {
        weight: number;
        key: string;
        ignore: boolean;
        type?: undefined;
        input?: undefined;
        label?: undefined;
        tooltip?: undefined;
        defaultValue?: undefined;
        reorder?: undefined;
        components?: undefined;
    })[];
};
export default _default;

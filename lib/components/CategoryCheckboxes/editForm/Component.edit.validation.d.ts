declare const _default: ({
    weight: number;
    type: string;
    key: string;
    defaultValue: string;
    input: boolean;
    label: string;
    tooltip: string;
    dataSrc: string;
    data: {
        values: {
            label: string;
            value: string;
        }[];
    };
    placeholder?: undefined;
} | {
    weight: number;
    type: string;
    label: string;
    tooltip: string;
    key: string;
    input: boolean;
    defaultValue: boolean;
    dataSrc?: undefined;
    data?: undefined;
    placeholder?: undefined;
} | {
    weight: number;
    key: string;
    label: string;
    placeholder: string;
    type: string;
    tooltip: string;
    input: boolean;
    defaultValue?: undefined;
    dataSrc?: undefined;
    data?: undefined;
} | {
    type: string;
    input: boolean;
    key: string;
    label: string;
    tooltip: string;
    weight: number;
})[];
export default _default;

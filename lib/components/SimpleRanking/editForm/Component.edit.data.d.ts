declare const _default: ({
    type: string;
    input: boolean;
    label: string;
    key: string;
    tooltip: string;
    weight: number;
    reorder: boolean;
    defaultValue: {
        label: string;
    }[];
    components: {
        label: string;
        key: string;
        input: boolean;
        type: string;
        placeholder: string;
        validate: {
            required: boolean;
        };
    }[];
} | {
    type: string;
    input: boolean;
    key: string;
    label: string;
    tooltip: string;
    weight: number;
    defaultValue: boolean;
    reorder?: undefined;
    components?: undefined;
})[];
export default _default;

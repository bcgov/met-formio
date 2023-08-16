declare const _default: ({
    type: string;
    label: string;
    key: string;
    weight: number;
    placeholder: string;
    tooltip: string;
    input: boolean;
    reorder?: undefined;
    defaultValue?: undefined;
    components?: undefined;
} | {
    type: string;
    input: boolean;
    label: string;
    key: string;
    weight: number;
    reorder: boolean;
    defaultValue: {
        label: string;
        value: string;
    }[];
    components: ({
        weight: number;
        label: string;
        key: string;
        input: boolean;
        type: string;
        tooltip: string;
        validate: {
            required: boolean;
        };
        allowCalculateOverride?: undefined;
        calculateValue?: undefined;
        dataSrc?: undefined;
        valueProperty?: undefined;
        hidden?: undefined;
        customDefaultValue?: undefined;
        template?: undefined;
        data?: undefined;
    } | {
        weight: number;
        label: string;
        key: string;
        input: boolean;
        type: string;
        tooltip: string;
        allowCalculateOverride: boolean;
        calculateValue: {
            _camelCase: {
                var: string;
            }[];
        };
        validate: {
            required: boolean;
        };
        dataSrc?: undefined;
        valueProperty?: undefined;
        hidden?: undefined;
        customDefaultValue?: undefined;
        template?: undefined;
        data?: undefined;
    } | {
        type: string;
        input: boolean;
        weight: number;
        label: string;
        key: string;
        tooltip: string;
        dataSrc: string;
        valueProperty: string;
        hidden: boolean;
        customDefaultValue: () => string;
        template: string;
        data: {
            custom(context: any): any;
        };
        validate?: undefined;
        allowCalculateOverride?: undefined;
        calculateValue?: undefined;
    })[];
    placeholder?: undefined;
    tooltip?: undefined;
})[];
export default _default;

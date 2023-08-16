import common from '../../Common/Simple.edit.data';

export default [
    ...common,
    {
        key: 'multiple',
        ignore: true,
    },
    {
        key: 'persistent',
        ignore: true,
    },
    {
        key: 'protected',
        ignore: true,
    },
    {
        key: 'dbIndex',
        ignore: true,
    },
    {
        key: 'encrypted',
        ignore: true,
    },
    {
        key: 'redrawOn',
        ignore: true,
    },
    {
        key: 'clearOnHide',
        ignore: true,
    },
    {
        key: 'allowCalculateOverride',
        ignore: true,
    },
    {
        key: 'calculateServer',
        ignore: true,
    },
    {
        key: 'customDefaultValue',
        ignore: true,
    },
    {
        key: 'calculateValue',
        ignore: true,
    },
    {
        type: 'datagrid',
        input: true,
        label: 'Questions',
        key: 'questions',
        tooltip: 'The questions you would like to ask in this survey question.',
        weight: 0,
        reorder: true,
        defaultValue: [{ label: '', value: '' }],
        components: [
            {
                label: 'Label',
                key: 'label',
                input: true,
                type: 'textfield',
            },
            {
                label: 'Value',
                key: 'value',
                input: true,
                type: 'textfield',
                allowCalculateOverride: true,
                calculateValue: { _camelCase: [{ var: 'row.label' }] },
            },
            {
                label: 'Tooltip',
                key: 'tooltip',
                input: true,
                type: 'textfield',
            },
        ],
    },
    {
        type: 'datagrid',
        input: true,
        label: 'Values',
        key: 'values',
        tooltip: "The values that can be selected per question. Example: 'Satisfied', 'Very Satisfied', etc.",
        weight: 1,
        reorder: true,
        defaultValue: [{ label: '', value: '' }],
        components: [
            {
                label: 'Label',
                key: 'label',
                input: true,
                type: 'textfield',
            },
            {
                label: 'Value',
                key: 'value',
                input: true,
                type: 'textfield',
                allowCalculateOverride: true,
                calculateValue: { _camelCase: [{ var: 'row.label' }] },
            },
            {
                label: 'Tooltip',
                key: 'tooltip',
                input: true,
                type: 'textfield',
            },
        ],
    },
];

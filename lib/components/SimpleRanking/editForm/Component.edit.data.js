export default [
    {
        type: 'datagrid',
        input: true,
        label: 'Statements to Rank',
        key: 'statements',
        tooltip: 'Enter the statements that users will rank. The number of ranking options will automatically match the number of statements.',
        weight: 0,
        reorder: true,
        defaultValue: [{ label: '' }],
        components: [
            {
                label: 'ID',
                key: 'id',
                input: true,
                type: 'hidden',
                allowCalculateOverride: true,
                calculateValue: 'value = value || ("stmt_" + Math.random().toString(36).substr(2, 9));',
            },
            {
                label: 'Statement',
                key: 'label',
                input: true,
                type: 'textfield',
                placeholder: 'Enter a statement',
                validate: {
                    required: true,
                },
            },
        ],
    },
    {
        type: 'checkbox',
        input: true,
        key: 'randomizeOrder',
        label: 'Randomize Statement Order',
        tooltip: 'When enabled, the order of statements will be randomized each time the form is loaded. This helps reduce bias in responses.',
        weight: 10,
        defaultValue: false,
    },
];

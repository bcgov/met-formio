import { Constants } from '../../Common/Constants';

export default [
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
                validate: {
                    pattern: Constants.NO_PERIOD_PATTERN,
                },
                errors: {
                    pattern: Constants.NO_PERIOD_VALIDATION_MESSAGE,
                },
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
        // Answer values are compared, never used as a path, so periods stay allowed.
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
    {
        type: 'content',
        key: 'likertScaleHelp',
        input: false,
        weight: 2,
        html:
            '<div class="help-text">' +
            '<i class="fa fa-info-circle" aria-hidden="true"></i>' +
            '<span>The Likert Component is fixed to a 5-point scale: value 1 is negative, ' +
            'value 2 is neutral, values 3\u20135 are positive.</span>' +
            '</div>',
    },
    {
        type: 'textfield',
        label: 'Default Value',
        key: 'defaultValue',
        weight: 5,
        placeholder: 'Default Value',
        tooltip: 'This will be the value for this field, before user interaction.',
        input: true,
    },
];

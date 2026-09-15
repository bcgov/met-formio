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
        // Datagrid templates render the label straight into the table, leaving no slot for a
        // notice, so the visible "Values" label lives here and the grid's own label is hidden.
        type: 'content',
        key: 'likertScaleHelp',
        input: false,
        weight: 1,
        html:
            '<label class="col-form-label" aria-hidden="true">Values</label>' +
            '<div class="help-text">' +
            '<i class="fa fa-info-circle" aria-hidden="true"></i>' +
            '<span>The Likert Component is fixed to a 5-point scale: value 1 is negative, ' +
            'value 2 is neutral, values 3\u20135 are positive.</span>' +
            '</div>',
    },
    {
        // Answer values are compared, never used as a path, so periods stay allowed.
        type: 'datagrid',
        input: true,
        label: 'Values',
        hideLabel: true,
        key: 'values',
        weight: 2,
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
        type: 'textfield',
        label: 'Default Value',
        key: 'defaultValue',
        weight: 5,
        placeholder: 'Default Value',
        tooltip: 'This will be the value for this field, before user interaction.',
        input: true,
    },
];

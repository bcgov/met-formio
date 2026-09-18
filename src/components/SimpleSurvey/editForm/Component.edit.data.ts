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
            '<span>This scale defaults to the standard 5-point classification: 2 negative, 1 neutral, ' +
            "2 positive. Edit each row's classification if this survey needs a different scale.</span>" +
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
        validate: { maxLength: Constants.LIKERT_MAX_VALUES },
        defaultValue: Constants.LIKERT_DEFAULT_VALUES,
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
                label: 'Classification',
                key: 'classification',
                input: true,
                type: 'select',
                widget: 'html5',
                dataSrc: 'values',
                data: { values: Constants.LIKERT_CLASSIFICATIONS },
                validate: {
                    required: true,
                    custom:
                        'var taken = (data.values || []).filter(function (v) { return v.classification === input; });' +
                        ` valid = !input || taken.length <= 1 ? true : ${JSON.stringify(
                            Constants.LIKERT_DUPLICATE_CLASSIFICATION_MESSAGE,
                        )};`,
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
        type: 'textfield',
        label: 'Default Value',
        key: 'defaultValue',
        weight: 5,
        placeholder: 'Default Value',
        tooltip: 'This will be the value for this field, before user interaction.',
        input: true,
    },
];

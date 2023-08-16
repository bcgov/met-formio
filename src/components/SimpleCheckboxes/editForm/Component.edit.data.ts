import BuilderUtils from 'formiojs/utils/builder';
import _ from 'lodash';

export default [
    {
        type: 'textfield',
        label: 'Default Value',
        key: 'defaultValue',
        weight: 5,
        placeholder: 'Default Value',
        tooltip:
            'Enter your labels for this question below and select here any options you want pre-selected to true (already selected). ',
        input: true,
    },
    {
        type: 'datagrid',
        input: true,
        label: 'Labels and Values',
        key: 'values',
        weight: 10,
        reorder: true,
        defaultValue: [{ label: '', value: '' }],
        components: [
            {
                weight: 160,
                label: 'Labels',
                key: 'label',
                input: true,
                type: 'textfield',
                tooltip:
                    'Labels are the text that appears next to the radio buttons on the form (the possible “answers”.)',
                validate: {
                    required: true,
                },
            },
            {
                weight: 170,
                label: 'Values',
                key: 'value',
                input: true,
                type: 'textfield',
                tooltip:
                    'Values are text submitted with the form data. They will not appear on the form. Values will be automatically generated when you enter the labels. They are editable.',
                allowCalculateOverride: true,
                calculateValue: { _camelCase: [{ var: 'row.label' }] },
                validate: {
                    required: true,
                },
            },
            {
                type: 'select',
                input: true,
                weight: 180,
                label: 'Shortcut',
                key: 'shortcut',
                tooltip: 'The shortcut key for this option.',
                dataSrc: 'custom',
                valueProperty: 'value',
                hidden: true,
                customDefaultValue: () => '',
                template: '{{ item.label }}',
                data: {
                    custom(context) {
                        return BuilderUtils.getAvailableShortcuts(
                            _.get(context, 'instance.options.editForm', {}),
                            _.get(context, 'instance.options.editComponent', {}),
                        );
                    },
                },
            },
        ],
    },
];

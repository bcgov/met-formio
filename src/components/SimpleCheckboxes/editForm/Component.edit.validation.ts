import common from '../../Common/Simple.edit.validation';

export default [
    ...common,
    {
        type: 'number',
        input: true,
        key: 'validate.minSelectedCount',
        label: 'Minimum checked number',
        tooltip: 'Minimum checkboxes required before form can be submitted.',
        weight: 250,
    },
    {
        type: 'number',
        input: true,
        key: 'validate.maxSelectedCount',
        label: 'Maximum checked number',
        tooltip: 'Maximum checkboxes possible before form can be submitted.',
        weight: 250,
    },
    {
        type: 'textfield',
        input: true,
        key: 'minSelectedCountMessage',
        label: 'Minimum checked error message',
        tooltip: 'Error message displayed if minimum number of items not checked.',
        weight: 250,
    },
    {
        type: 'textfield',
        input: true,
        key: 'maxSelectedCountMessage',
        label: 'Maximum checked error message',
        tooltip: 'Error message displayed if maximum number of items checked.',
        weight: 250,
    },
    {
        weight: 280,
        key: 'validate.minLength',
        label: ' Minimum Character Length',
        placeholder: 'Minimum Character Length',
        type: 'number',
        tooltip: 'This is the minimum number of characters required for this field.',
        input: true,
    },
    {
        weight: 300,
        key: 'validate.maxLength',
        label: 'Maximum Character Length',
        placeholder: 'Maximum Character Length',
        type: 'number',
        tooltip: 'This is the maximum number of characters required for this field.',
        input: true,
    },
];

import common from '../../Common/Simple.edit.validation';
export default [
    ...common,
    {
        weight: 110,
        key: 'validate.minLength',
        label: ' Minimum Character Length',
        placeholder: 'Minimum Character Length',
        type: 'number',
        tooltip: 'This is the minimum number of characters required for this field.',
        input: true,
    },
    {
        weight: 120,
        key: 'validate.maxLength',
        label: 'Maximum Character Length',
        placeholder: 'Maximum Character Length',
        type: 'number',
        tooltip: 'This is the maximum number of characters required for this field.',
        input: true,
    },
];

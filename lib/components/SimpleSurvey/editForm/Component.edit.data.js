var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import common from '../../Common/Simple.edit.data';
export default __spreadArray(__spreadArray([], common, true), [
    {
        key: 'multiple',
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
], false);

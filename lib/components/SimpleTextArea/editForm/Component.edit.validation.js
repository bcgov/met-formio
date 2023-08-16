var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import common from '../../Common/Simple.edit.validation';
export default __spreadArray(__spreadArray([], common, true), [
    {
        weight: 110,
        key: 'validate.minLength',
        label: 'Minimum Character Length',
        placeholder: 'Minimum Character Length',
        type: 'number',
        tooltip: 'This is the minimum number of characters required for this field. ',
        input: true,
    },
    {
        weight: 120,
        key: 'validate.maxLength',
        label: 'Maximum Character Length',
        placeholder: 'Maximum Character Length',
        type: 'number',
        tooltip: 'This is the maximum number of characters required for this field. ',
        input: true,
    },
    {
        weight: 125,
        key: 'validate.minWords',
        label: 'Minimum Word Length',
        placeholder: 'Minimum Word Length',
        type: 'number',
        tooltip: 'The minimum amount of words that can be added to this field.',
        input: true,
    },
    {
        weight: 126,
        key: 'validate.maxWords',
        label: 'Maximum Word Length',
        placeholder: 'Maximum Word Length',
        type: 'number',
        tooltip: 'The maximum amount of words that can be added to this field.',
        input: true,
    },
], false);

import { Components } from '@formio/js';
import EditDisplay from './editForm/Component.edit.display';
import SimpleConditional from '../Common/Simple.edit.conditional';
import SimpleValidation from '../Common/Simple.edit.validation';
const BaseComponent = Components.components.component;
export default function (...extend) {
    return BaseComponent.editForm([
        {
            key: 'data',
            ignore: true,
        },
        {
            key: 'api',
            ignore: true,
        },
        {
            key: 'layout',
            ignore: true,
        },
        {
            key: 'conditional',
            ignore: true,
        },
        {
            key: 'validation',
            ignore: true,
        },
        {
            key: 'logic',
            ignore: true,
        },
        {
            key: 'addons',
            ignore: true,
        },
        { key: 'display', ignore: true },
        {
            label: 'Display',
            key: 'customDisplay',
            weight: 20,
            components: EditDisplay,
        },
        {
            label: 'Validation',
            key: 'customValidation',
            weight: 20,
            components: SimpleValidation,
        },
        {
            label: 'Conditions',
            key: 'customConditional',
            weight: 40,
            components: SimpleConditional,
        },
    ], ...extend);
}

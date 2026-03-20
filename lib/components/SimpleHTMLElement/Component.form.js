import { Components } from '@formio/js';
import SimpleConditional from '../Common/Simple.edit.conditional';
import EditDisplay from './editForm/Component.edit.display';
const BaseHTMLElementComponent = Components.components.htmlelement;
export default function (...extend) {
    return BaseHTMLElementComponent.editForm([
        EditDisplay,
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
        {
            label: 'Conditions',
            key: 'customConditional',
            weight: 40,
            components: SimpleConditional,
        },
    ], ...extend);
}

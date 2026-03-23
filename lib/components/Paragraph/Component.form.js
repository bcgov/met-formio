import { Components } from '@formio/js';
import EditDisplay from './editForm/Component.edit.display';
const BaseComponent = Components.components.component;
export default function (...extend) {
    return BaseComponent.editForm([
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
    ], ...extend);
}

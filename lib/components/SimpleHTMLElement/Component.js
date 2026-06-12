import { Components } from '@formio/js';
import editForm from './Component.form';
import { Constants } from '../Common/Constants';
const ID = 'simplehtmlelement';
const DISPLAY = 'HTML Element';
export default function createSimpleHTMLElement() {
    const ParentComponent = Components.components.htmlelement;
    class Component extends ParentComponent {
        static schema(...extend) {
            return ParentComponent.schema({
                type: ID,
                label: DISPLAY,
                key: ID,
                tag: 'p',
            }, ...extend);
        }
        static get builderInfo() {
            return {
                title: DISPLAY,
                group: 'layout',
                icon: 'code',
                weight: 100,
                documentation: Constants.DEFAULT_HELP_LINK,
                schema: Component.schema(),
            };
        }
    }
    Component.editForm = editForm;
    return Component;
}

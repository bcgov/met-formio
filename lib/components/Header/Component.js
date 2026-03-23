import { Components } from '@formio/js';
const ParentComponent = Components.components.htmlelement;
import editForm from './Component.form';
import { Constants } from '../Common/Constants';
const ID = 'header';
const DISPLAY = 'Header';
class Component extends ParentComponent {
    static schema(...extend) {
        return ParentComponent.schema({
            type: ID,
            label: DISPLAY,
            key: ID,
            tag: 'h1',
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: DISPLAY,
            group: 'simple',
            icon: 'header',
            weight: 1,
            documentation: Constants.DEFAULT_HELP_LINK,
            schema: Component.schema(),
        };
    }
}
Component.editForm = editForm;
export default Component;

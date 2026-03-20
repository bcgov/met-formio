import { Components } from '@formio/js';
const ParentComponent = Components.components.selectboxes;
import editForm from './Component.form';
import { Constants } from '../Common/Constants';
const ID = 'simplecheckboxes';
const DISPLAY = 'Checkbox';
const DEFAULT_DESCRIPTION = 'Check all that apply.';
class Component extends ParentComponent {
    static schema(...extend) {
        return ParentComponent.schema({
            type: ID,
            label: DISPLAY,
            key: ID,
            description: DEFAULT_DESCRIPTION,
            inline: false,
            values: [{ label: '', value: '' }],
            fieldSet: false,
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: DISPLAY,
            group: 'simple',
            icon: 'check-square-o',
            weight: 70,
            documentation: Constants.DEFAULT_HELP_LINK,
            schema: Component.schema(),
        };
    }
}
Component.editForm = editForm;
export default Component;

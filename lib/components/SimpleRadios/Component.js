import { Components } from '@formio/js';
const ParentComponent = Components.components.radio;
import editForm from './Component.form';
import { Constants } from '../Common/Constants';
const ID = 'simpleradios';
const DISPLAY = 'Radio Button';
const DEFAULT_DESCRIPTION = 'Choose one of the answers above.';
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
            icon: 'dot-circle-o',
            weight: 60,
            documentation: Constants.DEFAULT_HELP_LINK,
            schema: Component.schema(),
        };
    }
}
Component.editForm = editForm;
export default Component;

import { Components } from '@formio/js';
const ParentComponent = Components.components.textfield;
import editForm from './Component.form';
import { Constants } from '../Common/Constants';
const ID = 'simplepostalcode';
const DISPLAY = 'Postal Code';
const DEFAULT_DESCRIPTION = 'Please input the first three characters of your postal code in the format like V9E.';
class Component extends ParentComponent {
    static schema(...extend) {
        return ParentComponent.schema({
            type: ID,
            label: DISPLAY,
            key: ID,
            description: DEFAULT_DESCRIPTION,
            inputType: 'postalcode',
            inputFormat: 'plain',
            inputMask: '***',
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: DISPLAY,
            group: 'simple',
            icon: 'map',
            weight: 40,
            documentation: Constants.DEFAULT_HELP_LINK,
            schema: Component.schema(),
        };
    }
}
Component.editForm = editForm;
export default Component;

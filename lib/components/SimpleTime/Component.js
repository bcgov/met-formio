import { Components } from '@formio/js';
const ParentComponent = Components.components.time;
import editForm from './Component.form';
import { Constants } from '../Common/Constants';
const ID = 'simpletime';
const DISPLAY = 'Time';
const defaultDataFormat = 'HH:mm:ss';
class Component extends ParentComponent {
    static schema(...extend) {
        return ParentComponent.schema({
            type: ID,
            label: DISPLAY,
            key: ID,
            inputType: 'time',
            format: 'HH:mm',
            dataFormat: defaultDataFormat,
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: DISPLAY,
            group: 'simple',
            icon: 'clock-o',
            weight: 22,
            documentation: Constants.DEFAULT_HELP_LINK,
            schema: Component.schema()
        };
    }
}
Component.editForm = editForm;
export default Component;

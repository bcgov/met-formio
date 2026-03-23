import { Components } from '@formio/js';
const ParentComponent = Components.components.textarea;
import editForm from './Component.form';
import { Constants } from '../Common/Constants';
const ID = 'simpletextarea';
const DISPLAY = 'Multiple Lines Answer';
const DEFAULT_DESCRIPTION = 'Please do not include any personally identifiable information about yourself or others in your responses.';
class Component extends ParentComponent {
    static schema(...extend) {
        return ParentComponent.schema({
            type: ID,
            label: DISPLAY,
            key: ID,
            description: DEFAULT_DESCRIPTION,
            rows: 3,
            wysiwyg: false,
            editor: '',
            spellcheck: true,
            fixedSize: true,
            inputFormat: 'plain',
            validate: {
                minWords: '',
                maxWords: '',
            },
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: DISPLAY,
            group: 'simple',
            icon: 'comment-o',
            weight: 30,
            documentation: Constants.DEFAULT_HELP_LINK,
            schema: Component.schema(),
        };
    }
}
Component.editForm = editForm;
export default Component;

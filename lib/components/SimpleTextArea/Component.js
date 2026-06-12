import { Components } from '@formio/js';
import editForm from './Component.form';
import { Constants } from '../Common/Constants';
const DEFAULT_MAX_LENGTH = Constants.DEFAULT_MAX_CHARACTER_LENGTH;
const DEFAULT_MAX_LENGTH_MESSAGE = Constants.DEFAULT_MAX_CHARACTER_LENGTH_MESSAGE;
const DEFAULT_REQUIRED_MESSAGE = Constants.DEFAULT_REQUIRED_VALIDATION_MESSAGE;
const ID = 'simpletextarea';
const DISPLAY = 'Multiple Lines Answer';
const DEFAULT_DESCRIPTION = 'Please do not include any personally identifiable information about yourself or others in your responses.';
export default function createSimpleTextArea() {
    const ParentComponent = Components.components.textarea;
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
                errors: {
                    required: DEFAULT_REQUIRED_MESSAGE,
                    maxLength: DEFAULT_MAX_LENGTH_MESSAGE,
                },
                validate: {
                    minWords: '',
                    maxWords: '',
                    maxLength: DEFAULT_MAX_LENGTH,
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
        attach(element) {
            this.component.validate = this.component.validate || {};
            // Apply default max length if not specified, or cap if builder exceeded the limit
            if (!this.component.validate.maxLength ||
                this.component.validate.maxLength > DEFAULT_MAX_LENGTH) {
                this.component.validate.maxLength = DEFAULT_MAX_LENGTH;
            }
            return super.attach(element);
        }
    }
    Component.editForm = editForm;
    return Component;
}

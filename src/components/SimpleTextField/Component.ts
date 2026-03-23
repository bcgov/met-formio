import { Components } from '@formio/js';
const ParentComponent = (Components as any).components.textfield;
import editForm from './Component.form';

import { Constants } from '../Common/Constants';

const ID = 'simpletextfield';
const DISPLAY = 'Single Line Answer';
const DEFAULT_DESCRIPTION = 'Please do not include any personally identifiable information about yourself or others in your responses.';

export default class Component extends (ParentComponent as any) {
    static schema(...extend) {
        return {
            ...ParentComponent.schema(),
            ...{
                type: ID,
                label: DISPLAY,
                key: ID,
                description: DEFAULT_DESCRIPTION,
                mask: false,
                inputType: 'text',
                inputFormat: 'plain',
                inputMask: '',
                tableView: false,
                spellcheck: true,
                widget: {
                    type: 'input',
                },
                validate: {
                    minLength: '',
                    maxLength: '',
                    pattern: '',
                },
            },
            ...extend,
        };
    }

    public static editForm = editForm;

    static get builderInfo() {
        return {
            title: DISPLAY,
            group: 'simple',
            icon: 'terminal',
            weight: 20,
            documentation: Constants.DEFAULT_HELP_LINK,
            schema: Component.schema(),
        };
    }
}

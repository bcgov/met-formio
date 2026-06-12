import { Components } from '@formio/js';
import editForm from './Component.form';

import { Constants } from '../Common/Constants';

const ID = 'simplepostalcode';
const DISPLAY = 'Postal Code';
const DEFAULT_DESCRIPTION = 'Please input the first three characters of your postal code in the format like V9E.';

export default function createSimplePostalCode() {
    const ParentComponent = (Components as any).components.textfield;
    class Component extends (ParentComponent as any) {
        static schema(...extend) {
            return ParentComponent.schema(
                {
                    type: ID,
                    label: DISPLAY,
                    key: ID,
                    description: DEFAULT_DESCRIPTION,
                    inputType: 'postalcode',
                    inputFormat: 'plain',
                    inputMask: '***',
                    errors: {
                        required: Constants.DEFAULT_REQUIRED_VALIDATION_MESSAGE,
                    },
                },
                ...extend
            );
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
    return Component;
}

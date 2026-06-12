import { Components } from '@formio/js';
import editForm from './Component.form';

import { Constants } from '../Common/Constants';

const ID = 'simpletime';
const DISPLAY = 'Time';

const defaultDataFormat = 'HH:mm:ss';

export default function createSimpleTime() {
    const ParentComponent = (Components as any).components.time;
    class Component extends (ParentComponent as any) {
        static schema(...extend) {
            return ParentComponent.schema({
                type: ID,
                label: DISPLAY,
                key: ID,
                inputType: 'time',
                format: 'HH:mm',
                dataFormat: defaultDataFormat,
                errors: {
                    required: Constants.DEFAULT_REQUIRED_VALIDATION_MESSAGE,
                },
            }, ...extend);
        }

        static get builderInfo() {
            return {
                title: DISPLAY,
                group: 'simple',
                icon: 'clock-o',
                weight: 22,
                documentation: Constants.DEFAULT_HELP_LINK,
                schema: Component.schema(),
            };
        }
    }
    Component.editForm = editForm;
    return Component;
}

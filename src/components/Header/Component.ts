import { Components } from '@formio/js';
import editForm from './Component.form';

import { Constants } from '../Common/Constants';

const ID = 'header';
const DISPLAY = 'Header';

export default function createHeader() {
    const ParentComponent = (Components as any).components.htmlelement;
    class Component extends (ParentComponent as any) {
        static schema(...extend) {
            return ParentComponent.schema(
                {
                    type: ID,
                    label: DISPLAY,
                    key: ID,
                    tag: 'h1',
                },
                ...extend,
            );
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
    return Component;
}

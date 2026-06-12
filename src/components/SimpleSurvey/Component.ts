import { Components } from '@formio/js';
import editForm from './Component.form';

import { Constants } from '../Common/Constants';

const ID = 'simplesurvey';
const DISPLAY = 'Likert';
const DEFAULT_DESCRIPTION = 'Please select the option that best applies.';

export default function createSimpleSurvey() {
    const ParentComponent = (Components as any).components.survey;
    class Component extends (ParentComponent as any) {
        static schema(...extend) {
            return ParentComponent.schema(
                {
                    type: ID,
                    label: DISPLAY,
                    key: ID,
                    description: DEFAULT_DESCRIPTION,
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
                icon: 'list',
                weight: 36,
                documentation: Constants.DEFAULT_HELP_LINK,
                schema: Component.schema(),
            };
        }

        // validateRequiredSurvey rule only matches component.type === 'survey',
        // explicitly check all questions are answered if this is a simplesurvey component with required validation.
        checkValidity(data, dirty, rowData) {
            if (this.component.validate?.required) {
                const value = this.dataValue || {};
                const questions: Array<{ value: string }> = this.component.questions || [];
                const allAnswered = questions.every((q) => value[q.value]);
                if (!allAnswered) {
                    this.setCustomValidity('This field is required.', dirty);
                    return false;
                }
            }

            const isValid = super.checkValidity(data, dirty, rowData);
            if (isValid) {
                this.setCustomValidity('', dirty);
            }
            return isValid;
        }
    }
    Component.editForm = editForm;
    return Component;
}

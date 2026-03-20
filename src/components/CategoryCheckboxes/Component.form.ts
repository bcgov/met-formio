import { Components } from '@formio/js';
import EditDisplay from './editForm/Component.edit.display';
import EditValidation from './editForm/Component.edit.validation';
import SimpleConditional from '../Common/Simple.edit.conditional';

const BaseRadioComponent = (Components as any).components.radio;

export default function (...extend) {
    return BaseRadioComponent.editForm(
        [
            EditDisplay,
            {
                key: 'api',
                ignore: true,
            },
            {
                key: 'layout',
                ignore: true,
            },
            {
                key: 'conditional',
                ignore: true,
            },
            {
                key: 'validation',
                ignore: true,
            },
            {
                label: 'Validation',
                key: 'customValidation',
                weight: 20,
                components: EditValidation,
            },
            {
                label: 'Conditions',
                key: 'customConditional',
                weight: 40,
                components: SimpleConditional,
            },
        ],
        ...extend,
    );
}

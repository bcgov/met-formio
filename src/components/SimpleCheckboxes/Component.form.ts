import radioEditForm from 'formiojs/components/radio/Radio.form';
import EditData from './editForm/Component.edit.data';
import EditDisplay from './editForm/Component.edit.display';
import EditValidation from './editForm/Component.edit.validation';
import SimpleConditional from '../Common/Simple.edit.conditional';

export default function (...extend) {
    return radioEditForm(
        [
            {
                key: 'data',
                ignore: true,
            },
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
                key: 'logic',
                ignore: true,
            },
            {
                key: 'display',
                ignore: true,
            },
            {
                label: 'Display',
                key: 'customDisplay',
                weight: 10,
                components: EditDisplay,
            },
            {
                label: 'Values',
                key: 'customData',
                weight: 20,
                components: EditData,
            },
            {
                label: 'Validation',
                key: 'customValidation',
                weight: 30,
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

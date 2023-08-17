import baseEditForm from 'formiojs/components/_classes/component/Component.form';
import EditDisplay from './editForm/Component.edit.display';
import EditData from './editForm/Component.edit.data';
import EditValidation from './editForm/Component.edit.validation';

import SimpleConditional from '../Common/Simple.edit.conditional';

export default function (...extend) {
    return baseEditForm(
        [
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
                key: 'addons',
                ignore: true,
            },
            {
                key: 'display',
                ignore: true,
            },
            {
                key: 'data',
                ignore: true,
            },
            {
                label: 'Display',
                key: 'customDisplay',
                weight: 10,
                components: EditDisplay,
            },
            {
                key: 'customData',
                label: 'Values',
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

import baseEditForm from 'formiojs/components/_classes/component/Component.form';

import EditData from './editForm/Component.edit.data';
import EditDisplay from './editForm/Component.edit.display';
import EditValidation from './editForm/Component.edit.validation';

import SimpleConditional from '../Common/Simple.edit.conditional';

export default function (...extend) {
    return baseEditForm(
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
                key: 'addons',
                ignore: true,
            },
            {
                key: 'display',
                ignore: true,
            },
            {
                key: 'customDisplay',
                label: 'Display',
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

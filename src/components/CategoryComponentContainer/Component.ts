/* tslint:disable */
import { Components } from 'formiojs';
const ParentComponent = (Components as any).components.container;
import editForm from './Component.form';

import { Constants } from '../Common/Constants';
import { CHECKBOXES_VC } from '../CheckBoxesVC/Component';

const ID = 'categorycommentcontainer';
const DISPLAY = 'Category Comment';

export default class Component extends (ParentComponent as any) {
    static schema(...extend) {
        return ParentComponent.schema(
            {
                label: DISPLAY,
                tableView: false,
                key: ID,
                input: true,
                components: [
                    {
                        label: 'We would like to learn more about your concerns, thoughts, and idea in relation to the items you selected.',
                        key: 'textareavc',
                        type: 'textareavc',
                        rows: 3,
                        wysiwyg: false,
                        editor: '',
                        spellcheck: true,
                        fixedSize: true,
                        inputFormat: 'plain',
                        validate: {
                            minWords: '',
                            maxWords: '',
                        },
                        logic: [
                            {
                                name: 'componentChange event',
                                trigger: {
                                    type: 'event',
                                    event: 'componentChange',
                                },
                                actions: [
                                    {
                                        name: 'update value components',
                                        type: 'customAction',
                                        customAction:
                                            `const change = result[0]\nif(change && change.component.key === '${CHECKBOXES_VC}')` +
                                            ' {\n  const vcs = change.component.values.filter(vc => change.value[vc.value] && vc.value !== "other")\n' +
                                            '  instance.valueComponents = [...vcs]\n  instance.redraw()\n}',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        label: 'Tell us more about the other concerns that you have.',
                        key: 'textareavc1',
                        customConditional: `show = data && data['${CHECKBOXES_VC}'] && data['${CHECKBOXES_VC}']['other']`,
                        type: 'textareavc',
                        rows: 3,
                        wysiwyg: false,
                        editor: '',
                        spellcheck: true,
                        fixedSize: true,
                        inputFormat: 'plain',
                        validate: {
                            minWords: '',
                            maxWords: '',
                        },
                        logic: [
                            {
                                name: 'componentChange event',
                                trigger: {
                                    type: 'event',
                                    event: 'componentChange',
                                },
                                actions: [
                                    {
                                        name: 'update value components',
                                        type: 'customAction',
                                        customAction:
                                            `const change = result[0]\nif(change && change.component.key === '${CHECKBOXES_VC}')` +
                                            ' {\n  const vcs = change.component.values.filter(vc => vc.value === "other")\n' +
                                            '  instance.valueComponents = [...vcs]\n  instance.redraw()\n}',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            ...extend,
        );
    }

    public static editForm = editForm;

    static get builderInfo() {
        return {
            title: DISPLAY,
            group: 'simple',
            icon: 'pencil-square-o',
            weight: 40,
            documentation: Constants.DEFAULT_HELP_LINK,
            schema: Component.schema(),
        };
    }
}

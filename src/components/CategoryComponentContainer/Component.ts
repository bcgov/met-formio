/* tslint:disable */
import { Components } from 'formiojs';
const ParentComponent = (Components as any).components.container;
import editForm from './Component.form';

import { Constants } from '../Common/Constants';
import { CATEGORY_CHECKBOXES } from '../CategoryCheckboxes/Component';

const ID = 'categorycommentcontainer';
const DISPLAY = 'Category Comment';
const OTHER = 'other';

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
                        key: 'categorytextarea',
                        type: 'categorytextarea',
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
                                        name: 'update category components',
                                        type: 'customAction',
                                        customAction:
                                            `const change = result[0]\nif(change && change.component.key === '${CATEGORY_CHECKBOXES}')` +
                                            ` {\n  const filteredCategoryComponents = change.component.values.filter(cc => change.value[cc.value] && cc.value !== '${OTHER}')\n` +
                                            '  instance.categoryComponents = [...filteredCategoryComponents]\n  instance.redraw()\n}',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        label: 'Tell us more about the other concerns that you have.',
                        key: 'categorytextarea1',
                        customConditional: `show = data && data['${CATEGORY_CHECKBOXES}'] && data['${CATEGORY_CHECKBOXES}']['${OTHER}']`,
                        type: 'categorytextarea',
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
                                        name: 'update category components',
                                        type: 'customAction',
                                        customAction:
                                            `const change = result[0]\nif(change && change.component.key === '${CATEGORY_CHECKBOXES}')` +
                                            ` {\n  const filteredCategoryComponents = change.component.values.filter(cc => cc.value === '${OTHER}')\n` +
                                            '  instance.categoryComponents = [...filteredCategoryComponents]\n  instance.redraw()\n}',
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
            weight: 9,
            documentation: Constants.DEFAULT_HELP_LINK,
            schema: Component.schema(),
        };
    }
}

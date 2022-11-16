/* tslint:disable */
import { Components } from 'formiojs';
const ParentComponent = (Components as any).components.textarea;
import editForm from './Component.form';

import { Constants } from '../Common/Constants';
import { CHECKBOXES_VC } from '../CheckBoxesVC/Component';

const ID = 'textareavc';
const DISPLAY = 'Value Component Comment';

export default class Component extends (ParentComponent as any) {
    static schema(...extend) {
        return ParentComponent.schema(
            {
                type: ID,
                label: DISPLAY,
                key: ID,
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
                                    ' {\n  const vcs = change.component.values.filter(vc => vc.type === "main" && change.value[vc.value])\n' +
                                    '  instance.valueComponents = [...vcs]\n  instance.redraw()\n}',
                            },
                        ],
                    },
                ],
                defaultValueComponents: [],
            },
            ...extend,
        );
    }

    public static editForm = editForm;

    static get builderInfo() {
        return {
            title: DISPLAY,
            group: 'simple',
            icon: 'comment-o',
            weight: 2,
            documentation: Constants.DEFAULT_HELP_LINK,
            schema: Component.schema(),
        };
    }

    init() {
        super.init();
        this.valueComponents = this.component.defaultValueComponents ? [...this.component.defaultValueComponents] : [];
    }

    renderElement(value, index) {
        const info = this.inputInfo;
        info.attr = info.attr || {};
        info.content = value;
        if ((this.options.readOnly || this.disabled) && !this.isHtmlRenderMode()) {
            const elementStyle = this.info.attr.style || '';
            const children = `<div ref="input" class="formio-editor-read-only-content" ${
                elementStyle ? `style='${elementStyle}'` : ''
            }></div>`;

            return this.renderTemplate('well', {
                children,
                nestedKey: this.key,
                value,
            });
        }

        return this.renderTemplate('textareavc', {
            input: info,
            value,
            index,
            valueComponents: this.valueComponents,
        });
    }
}

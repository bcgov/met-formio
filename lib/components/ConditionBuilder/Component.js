import { Components } from '@formio/js';
import { eachComponent } from '@formio/js/utils';
import React from 'react';
import { createRoot } from 'react-dom/client';
import ConditionBuilderWidget from './ConditionBuilderWidget';
export default function createConditionBuilder() {
    const BaseComponent = Components.components.base;
    class ConditionBuilderComponent extends BaseComponent {
        constructor() {
            super(...arguments);
            this._reactRoot = null;
            this._container = null;
            this._valueKey = '';
            this._conflict = null;
            this._watchingConflicts = false;
        }
        static schema() {
            return {
                ...BaseComponent.schema(),
                type: 'conditionbuilder',
                label: '',
                key: 'conditionbuilder',
                input: true,
                tableView: false,
            };
        }
        // Not shown in the form builder palette — only used in edit forms
        static get builderInfo() {
            return false;
        }
        render() {
            return '<div class="met-condition-builder-mount"></div>';
        }
        attach(element) {
            const superResult = super.attach(element);
            this._container = element.querySelector('.met-condition-builder-mount') || element;
            this._valueKey = JSON.stringify(this.dataValue ?? null);
            this._conflict = this._getConflict();
            this._watchConflicts();
            this._renderReact();
            return superResult;
        }
        detach() {
            this._unmountReact();
            return super.detach();
        }
        destroy() {
            this._unmountReact();
            return super.destroy();
        }
        setValue(value) {
            const changed = super.setValue(value);
            const newKey = JSON.stringify(value ?? null);
            if (newKey !== this._valueKey) {
                this._valueKey = newKey;
                this._renderReact();
            }
            return changed;
        }
        _renderReact() {
            if (!this._container)
                return;
            const fields = this._getFields();
            const props = {
                key: this._valueKey,
                fields,
                initialValue: this.dataValue,
                conflict: this._conflict,
                onChange: (jsonLogic) => {
                    // Or the setValue() after triggerChange() remounts the React tree.
                    this._valueKey = JSON.stringify(jsonLogic ?? null);
                    this.dataValue = jsonLogic;
                    this.triggerChange();
                },
            };
            if (!this._reactRoot) {
                this._reactRoot = createRoot(this._container);
            }
            this._reactRoot.render(React.createElement(ConditionBuilderWidget, props));
        }
        _unmountReact() {
            if (this._reactRoot) {
                this._reactRoot.unmount();
                this._reactRoot = null;
            }
            this._container = null;
        }
        /**
         * checkCondition() resolves customConditional, then the simple conditional, and
         * only then conditional.json — so either of those silences the visual builder.
         */
        _getConflict() {
            const data = this.root?.data || {};
            if (data.customConditional)
                return 'custom';
            const conditional = data.conditional || {};
            if (conditional.when)
                return 'simple';
            const conditions = conditional.conditions || [];
            if (Array.isArray(conditions) && conditions.some((c) => c?.component && c?.operator)) {
                return 'simple';
            }
            return null;
        }
        _watchConflicts() {
            if (this._watchingConflicts)
                return;
            this._watchingConflicts = true;
            this.on('change', () => {
                const conflict = this._getConflict();
                if (conflict !== this._conflict) {
                    this._conflict = conflict;
                    this._renderReact();
                }
            });
        }
        _getFields() {
            try {
                const editForm = this.root?.options?.editForm;
                if (!editForm?.components)
                    return [];
                // Most display-only types are caught by `input === false` below, but
                // containers are inputs, and eachComponent already yields their children.
                const SKIP_TYPES = new Set([
                    'header', 'paragraph', 'simplecontent', 'simplehtmlelement',
                    'htmlelement', 'content', 'button',
                    'columns', 'fieldset', 'panel', 'well', 'tabs', 'table',
                    'container', 'categorycommentcontainer',
                    'hidden', 'conditionbuilder',
                ]);
                // selectboxes-derived components store { optionValue: boolean }
                const CHECKBOX_TYPES = new Set(['simplecheckboxes', 'categorycheckboxes']);
                const TEXT_OPS = [
                    { name: '=', label: 'equals' },
                    { name: '!=', label: 'does not equal' },
                    { name: 'contains', label: 'contains' },
                    { name: 'doesNotContain', label: 'does not contain' },
                    { name: 'null', label: 'is empty' },
                    { name: 'notNull', label: 'is not empty' },
                ];
                const SELECT_OPS = [
                    { name: '=', label: 'equals' },
                    { name: '!=', label: 'does not equal' },
                    { name: 'null', label: 'is empty' },
                    { name: 'notNull', label: 'is not empty' },
                ];
                const IN_OPS = [
                    { name: 'in', label: 'is one of' },
                    { name: 'notIn', label: 'is not one of' },
                ];
                const truncate = (s, n = 60) => s.length > n ? `${s.slice(0, n - 3)}...` : s;
                // jsonLogic's `var` splits on '.', so a dotted key is unreachable and any
                // condition on it would never match. Ranking ids are compared, not traversed.
                const addressable = (key) => typeof key === 'string' && key !== '' && !key.includes('.');
                const fields = [];
                const editedKey = this.root?.data?.key;
                eachComponent(editForm.components, (component) => {
                    if (!component.key)
                        return;
                    if (component.key === editedKey || component.key === this.component.key)
                        return;
                    if (!addressable(component.key))
                        return;
                    if (component.input === false)
                        return;
                    if (SKIP_TYPES.has(component.type))
                        return;
                    const rawLabel = component.label || component.key;
                    const parentLabel = `${truncate(rawLabel, 50)} (${component.key})`;
                    const fullParentLabel = `${rawLabel} (${component.key})`;
                    if (component.type === 'simplesurvey') {
                        const surveyValues = (component.values || []).map((v) => ({
                            name: v.value, label: v.label, value: v.value,
                        }));
                        (component.questions || []).forEach((q) => {
                            if (!addressable(q.value))
                                return;
                            fields.push({
                                name: `${component.key}.${q.value}`,
                                label: truncate(q.label),
                                _parentKey: component.key,
                                _parentLabel: parentLabel,
                                _fullLabel: q.label,
                                _fullParentLabel: fullParentLabel,
                                operators: IN_OPS,
                                valueEditorType: 'multiselect',
                                values: surveyValues,
                            });
                        });
                    }
                    else if (component.type === 'simpleranking') {
                        const statements = component.statements || [];
                        const rankCount = statements.length;
                        const rankValues = Array.from({ length: rankCount }, (_, i) => ({
                            name: String(i + 1), label: String(i + 1), value: String(i + 1),
                        }));
                        statements.forEach((stmt) => {
                            fields.push({
                                name: `${component.key}.${stmt.id}`,
                                label: truncate(stmt.label),
                                _parentKey: component.key,
                                _parentLabel: parentLabel,
                                _fullLabel: stmt.label,
                                _fullParentLabel: fullParentLabel,
                                _rankingComponentKey: component.key,
                                _statementId: stmt.id,
                                operators: IN_OPS,
                                valueEditorType: 'multiselect',
                                values: rankValues,
                            });
                        });
                    }
                    else if (CHECKBOX_TYPES.has(component.type) && component.values?.length) {
                        (component.values || []).forEach((v) => {
                            if (!addressable(v.value))
                                return;
                            fields.push({
                                name: `${component.key}.${v.value}`,
                                label: truncate(v.label),
                                _parentKey: component.key,
                                _parentLabel: parentLabel,
                                _fullLabel: v.label,
                                _fullParentLabel: fullParentLabel,
                                // selectboxes stores booleans; logic.ts converts on save.
                                _booleanValue: true,
                                operators: [{ name: '=', label: 'is' }],
                                valueEditorType: 'select',
                                values: [
                                    { name: 'true', label: 'checked', value: 'true' },
                                    { name: 'false', label: 'unchecked', value: 'false' },
                                ],
                            });
                        });
                    }
                    else if (['simpleradios', 'simpleselect'].includes(component.type) &&
                        component.values?.length) {
                        fields.push({
                            name: component.key,
                            label: parentLabel,
                            _fullLabel: fullParentLabel,
                            operators: SELECT_OPS,
                            valueEditorType: 'select',
                            values: component.values.map((v) => ({
                                name: v.value, label: v.label, value: v.value,
                            })),
                        });
                    }
                    else {
                        fields.push({
                            name: component.key,
                            label: parentLabel,
                            _fullLabel: fullParentLabel,
                            operators: TEXT_OPS,
                        });
                    }
                }, true);
                return fields;
            }
            catch {
                return [];
            }
        }
    }
    return ConditionBuilderComponent;
}

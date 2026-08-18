import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useId } from 'react';
export default function SurveyAwareFieldSelector({ value = '', options, handleOnChange, disabled, title, className, }) {
    const componentId = useId();
    const allFields = useMemo(() => options.flat(), [options]);
    const { nestedParents, regularFields, parentByField } = useMemo(() => {
        const parents = new Map();
        const regular = [];
        // Resolved by lookup, since splitting on '.' breaks on dotted keys.
        const byField = new Map();
        allFields.forEach(field => {
            const parentKey = field._parentKey;
            if (parentKey) {
                if (!parents.has(parentKey)) {
                    parents.set(parentKey, {
                        key: parentKey,
                        label: field._parentLabel || parentKey,
                        fullLabel: field._fullParentLabel
                            || field._parentLabel
                            || parentKey,
                        children: [],
                    });
                }
                parents.get(parentKey).children.push({
                    name: field.name,
                    label: field.label,
                    fullLabel: field._fullLabel || field.label,
                });
                byField.set(field.name, parentKey);
            }
            else {
                regular.push(field);
            }
        });
        return { nestedParents: parents, regularFields: regular, parentByField: byField };
    }, [allFields]);
    const selectedParent = parentByField.get(value) ?? '';
    const [activeSurveyKey, setActiveSurveyKey] = useState(selectedParent);
    useEffect(() => {
        setActiveSurveyKey(selectedParent);
    }, [selectedParent]);
    const activeSurvey = activeSurveyKey ? nestedParents.get(activeSurveyKey) : null;
    const firstDropdownValue = activeSurveyKey || value;
    const firstOptions = useMemo(() => [
        ...regularFields.map(f => ({
            value: f.name,
            label: f.label,
            fullLabel: f._fullLabel || f.label,
        })),
        ...[...nestedParents.values()].map(s => ({
            value: s.key,
            label: s.label,
            fullLabel: s.fullLabel,
        })),
    ], [regularFields, nestedParents]);
    const handleFirstChange = (e) => {
        const selected = e.target.value;
        const parent = nestedParents.get(selected);
        if (parent) {
            setActiveSurveyKey(selected);
            // Or the rule keeps its old field while displaying this component's name.
            if (parent.children.length > 0) {
                handleOnChange(parent.children[0].name);
            }
        }
        else {
            setActiveSurveyKey('');
            handleOnChange(selected);
        }
    };
    const selectedFullLabel = firstOptions.find(o => o.value === firstDropdownValue)?.fullLabel ?? title;
    return (_jsxs("div", { style: { display: 'inline-block', minWidth: '280px', maxWidth: '550px' }, children: [_jsx("label", { className: "small text-muted mb-1", htmlFor: `${componentId}-component`, children: "Component" }), _jsx("select", { id: `${componentId}-component`, className: `form-select ${className ?? ''}`, value: firstDropdownValue, onChange: handleFirstChange, disabled: disabled, title: selectedFullLabel, children: firstOptions.map(opt => (_jsx("option", { value: opt.value, title: opt.fullLabel, children: opt.label }, opt.value))) }), activeSurvey && (_jsxs(_Fragment, { children: [_jsx("div", { className: "small text-muted mt-2 mb-1", id: `${componentId}-sub`, children: "Sub-question" }), _jsx("div", { className: "list-group", role: "listbox", "aria-labelledby": `${componentId}-sub`, style: { maxHeight: '220px', overflowY: 'auto', fontSize: '0.875rem' }, children: activeSurvey.children.map(c => (_jsx("button", { type: "button", role: "option", "aria-selected": value === c.name, title: c.fullLabel, className: `list-group-item list-group-item-action py-1 px-2${value === c.name ? ' active' : ''}`, onClick: () => !disabled && handleOnChange(c.name), disabled: disabled, children: c.label }, c.name))) })] }))] }));
}

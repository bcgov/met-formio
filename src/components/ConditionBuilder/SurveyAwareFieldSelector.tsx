import { useState, useEffect, useMemo, useId, ChangeEvent } from 'react';
import type { Field, FieldSelectorProps } from 'react-querybuilder';

interface Child {
    /** Full field name. Never re-derived by splitting on '.'. */
    name: string;
    label: string;
    fullLabel: string;
}

interface NestedParent {
    key: string;
    label: string;
    fullLabel: string;
    children: Child[];
}

export default function SurveyAwareFieldSelector({
    value = '',
    options,
    handleOnChange,
    disabled,
    title,
    className,
}: FieldSelectorProps) {
    const componentId = useId();
    const allFields = useMemo(() => (options as any[]).flat() as Field[], [options]);

    const { nestedParents, regularFields, parentByField } = useMemo(() => {
        const parents = new Map<string, NestedParent>();
        const regular: Field[] = [];
        // Resolved by lookup, since splitting on '.' breaks on dotted keys.
        const byField = new Map<string, string>();

        allFields.forEach(field => {
            const parentKey = (field as any)._parentKey as string | undefined;
            if (parentKey) {
                if (!parents.has(parentKey)) {
                    parents.set(parentKey, {
                        key: parentKey,
                        label: (field as any)._parentLabel as string || parentKey,
                        fullLabel: (field as any)._fullParentLabel as string
                            || (field as any)._parentLabel as string
                            || parentKey,
                        children: [],
                    });
                }
                parents.get(parentKey)!.children.push({
                    name: field.name as string,
                    label: field.label as string,
                    fullLabel: (field as any)._fullLabel as string || field.label as string,
                });
                byField.set(field.name as string, parentKey);
            } else {
                regular.push(field);
            }
        });

        return { nestedParents: parents, regularFields: regular, parentByField: byField };
    }, [allFields]);

    const selectedParent = parentByField.get(value) ?? '';

    const [activeSurveyKey, setActiveSurveyKey] = useState<string>(selectedParent);

    useEffect(() => {
        setActiveSurveyKey(selectedParent);
    }, [selectedParent]);

    const activeSurvey = activeSurveyKey ? nestedParents.get(activeSurveyKey) : null;
    const firstDropdownValue = activeSurveyKey || value;

    const firstOptions = useMemo(() => [
        ...regularFields.map(f => ({
            value: f.name as string,
            label: f.label as string,
            fullLabel: (f as any)._fullLabel as string || f.label as string,
        })),
        ...[...nestedParents.values()].map(s => ({
            value: s.key,
            label: s.label,
            fullLabel: s.fullLabel,
        })),
    ], [regularFields, nestedParents]);

    const handleFirstChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        const parent = nestedParents.get(selected);
        if (parent) {
            setActiveSurveyKey(selected);
            // Or the rule keeps its old field while displaying this component's name.
            if (parent.children.length > 0) {
                handleOnChange(parent.children[0].name);
            }
        } else {
            setActiveSurveyKey('');
            handleOnChange(selected);
        }
    };

    const selectedFullLabel = firstOptions.find(o => o.value === firstDropdownValue)?.fullLabel ?? title;

    return (
        <div style={{ display: 'inline-block', minWidth: '280px', maxWidth: '550px' }}>
            <label className="small text-muted mb-1" htmlFor={`${componentId}-component`}>
                Component
            </label>
            <select
                id={`${componentId}-component`}
                className={`form-select ${className ?? ''}`}
                value={firstDropdownValue}
                onChange={handleFirstChange}
                disabled={disabled}
                title={selectedFullLabel}
            >
                {firstOptions.map(opt => (
                    <option key={opt.value} value={opt.value} title={opt.fullLabel}>{opt.label}</option>
                ))}
            </select>
            {activeSurvey && (
                <>
                    <div className="small text-muted mt-2 mb-1" id={`${componentId}-sub`}>
                        Sub-question
                    </div>
                    <div
                        className="list-group"
                        role="listbox"
                        aria-labelledby={`${componentId}-sub`}
                        style={{ maxHeight: '220px', overflowY: 'auto', fontSize: '0.875rem' }}
                    >
                        {activeSurvey.children.map(c => (
                            <button
                                key={c.name}
                                type="button"
                                role="option"
                                aria-selected={value === c.name}
                                title={c.fullLabel}
                                className={`list-group-item list-group-item-action py-1 px-2${value === c.name ? ' active' : ''}`}
                                onClick={() => !disabled && handleOnChange(c.name)}
                                disabled={disabled}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

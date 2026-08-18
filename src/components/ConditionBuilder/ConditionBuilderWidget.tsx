import { useState, useCallback, useMemo, useRef } from 'react';
import _ from 'lodash';
import { QueryBuilder, RuleGroupType, Field } from 'react-querybuilder';
import { QueryBuilderBootstrap } from '@react-querybuilder/bootstrap';
import SurveyAwareFieldSelector from './SurveyAwareFieldSelector';
import SurveyValueEditor from './SurveyValueEditor';
import { buildFieldMeta, parseInitialQuery, serializeCompleteRules, EMPTY_QUERY } from './logic';

/** Which higher-precedence setting is currently overriding conditional.json, if any. */
export type Conflict = 'simple' | 'custom' | null;

interface Props {
    fields: Field[];
    initialValue: any;
    onChange: (jsonLogic: any) => void;
    conflict?: Conflict;
}

const CONFLICT_MESSAGE: Record<'simple' | 'custom', string> = {
    simple: 'The "Simple" panel above has a condition set, and formio checks that first. '
        + 'Clear it for the conditions below to take effect.',
    custom: 'The "Advanced Conditions" panel has custom JavaScript, and formio checks that first. '
        + 'Clear it for the conditions below to take effect.',
};

export default function ConditionBuilderWidget({ fields, initialValue, onChange, conflict }: Props) {
    const meta = useMemo(() => buildFieldMeta(fields), [fields]);

    const [{ query: parsedQuery, lossy }] = useState(() => parseInitialQuery(initialValue, fields, meta));
    const [query, setQuery] = useState<RuleGroupType>(parsedQuery);

    // react-querybuilder fires onQueryChange once on mount. Emitting that would rewrite
    // conditional.json just because the dialog was opened, so only emit real changes.
    const lastEmitted = useRef<any>(serializeCompleteRules(parsedQuery, meta));

    const emit = useCallback((jsonLogic: any) => {
        if (_.isEqual(jsonLogic, lastEmitted.current)) return;
        lastEmitted.current = jsonLogic;
        onChange(jsonLogic);
    }, [onChange]);

    const handleQueryChange = useCallback((q: RuleGroupType) => {
        setQuery(q);
        emit(serializeCompleteRules(q, meta));
    }, [emit, meta]);

    const handleClearAll = useCallback(() => {
        setQuery(EMPTY_QUERY);
        emit(null);
    }, [emit]);

    if (fields.length === 0) {
        return (
            <div className="alert alert-info">
                No form components are available. Add other components to the form first.
            </div>
        );
    }

    return (
        <div>
            {conflict && (
                <div className="alert alert-warning">
                    <strong>These conditions are not being used.</strong> {CONFLICT_MESSAGE[conflict]}
                </div>
            )}
            {lossy && (
                <div className="alert alert-warning">
                    <strong>This component has existing conditional logic that the builder cannot
                    display.</strong> It still works and is left as-is, but adding or changing a
                    condition below will replace it entirely.
                </div>
            )}
            <div className="d-flex align-items-center justify-content-between mb-2">
                <p className="text-muted mb-0">
                    <strong>Show</strong> this component when the following conditions are met:
                </p>
                {query.rules.length > 0 && (
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={handleClearAll}
                    >
                        Clear all
                    </button>
                )}
            </div>
            <QueryBuilderBootstrap>
                <QueryBuilder
                    fields={fields}
                    query={query}
                    onQueryChange={handleQueryChange}
                    listsAsArrays
                    controlElements={{
                        fieldSelector: SurveyAwareFieldSelector,
                        valueEditor: SurveyValueEditor,
                    }}
                />
            </QueryBuilderBootstrap>
        </div>
    );
}

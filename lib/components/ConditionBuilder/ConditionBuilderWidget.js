import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useMemo, useRef } from 'react';
import _ from 'lodash';
import { QueryBuilder } from 'react-querybuilder';
import { QueryBuilderBootstrap } from '@react-querybuilder/bootstrap';
import SurveyAwareFieldSelector from './SurveyAwareFieldSelector';
import SurveyValueEditor from './SurveyValueEditor';
import { buildFieldMeta, parseInitialQuery, serializeCompleteRules, EMPTY_QUERY } from './logic';
const CONFLICT_MESSAGE = {
    simple: 'The "Simple" panel above has a condition set, and formio checks that first. '
        + 'Clear it for the conditions below to take effect.',
    custom: 'The "Advanced Conditions" panel has custom JavaScript, and formio checks that first. '
        + 'Clear it for the conditions below to take effect.',
};
export default function ConditionBuilderWidget({ fields, initialValue, onChange, conflict }) {
    const meta = useMemo(() => buildFieldMeta(fields), [fields]);
    const [{ query: parsedQuery, lossy }] = useState(() => parseInitialQuery(initialValue, fields, meta));
    const [query, setQuery] = useState(parsedQuery);
    // react-querybuilder fires onQueryChange once on mount. Emitting that would rewrite
    // conditional.json just because the dialog was opened, so only emit real changes.
    const lastEmitted = useRef(serializeCompleteRules(parsedQuery, meta));
    const emit = useCallback((jsonLogic) => {
        if (_.isEqual(jsonLogic, lastEmitted.current))
            return;
        lastEmitted.current = jsonLogic;
        onChange(jsonLogic);
    }, [onChange]);
    const handleQueryChange = useCallback((q) => {
        setQuery(q);
        emit(serializeCompleteRules(q, meta));
    }, [emit, meta]);
    const handleClearAll = useCallback(() => {
        setQuery(EMPTY_QUERY);
        emit(null);
    }, [emit]);
    if (fields.length === 0) {
        return (_jsx("div", { className: "alert alert-info", children: "No form components are available. Add other components to the form first." }));
    }
    return (_jsxs("div", { children: [conflict && (_jsxs("div", { className: "alert alert-warning", children: [_jsx("strong", { children: "These conditions are not being used." }), " ", CONFLICT_MESSAGE[conflict]] })), lossy && (_jsxs("div", { className: "alert alert-warning", children: [_jsx("strong", { children: "This component has existing conditional logic that the builder cannot display." }), " It still works and is left as-is, but adding or changing a condition below will replace it entirely."] })), _jsxs("div", { className: "d-flex align-items-center justify-content-between mb-2", children: [_jsxs("p", { className: "text-muted mb-0", children: [_jsx("strong", { children: "Show" }), " this component when the following conditions are met:"] }), query.rules.length > 0 && (_jsx("button", { type: "button", className: "btn btn-sm btn-outline-danger", onClick: handleClearAll, children: "Clear all" }))] }), _jsx(QueryBuilderBootstrap, { children: _jsx(QueryBuilder, { fields: fields, query: query, onQueryChange: handleQueryChange, listsAsArrays: true, controlElements: {
                        fieldSelector: SurveyAwareFieldSelector,
                        valueEditor: SurveyValueEditor,
                    } }) })] }));
}

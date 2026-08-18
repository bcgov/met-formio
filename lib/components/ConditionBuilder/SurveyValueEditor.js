import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ValueEditor } from 'react-querybuilder';
export default function SurveyValueEditor(props) {
    const { fieldData, value, handleOnChange, disabled } = props;
    // This editor emits an array, so single-valued fields (checkbox options included)
    // must keep the stock one or they end up as {"==": [.., ["true"]]}.
    if (fieldData?.valueEditorType !== 'multiselect') {
        return _jsx(ValueEditor, { ...props });
    }
    const surveyValues = (fieldData?.values ?? []);
    // QueryBuilder and parseJsonLogic both run with listsAsArrays, so this is an array.
    const selectedValues = Array.isArray(value) ? value : [];
    const toggle = (v) => {
        if (disabled)
            return;
        const next = selectedValues.includes(v)
            ? selectedValues.filter(x => x !== v)
            : [...selectedValues, v];
        handleOnChange(next);
    };
    if (surveyValues.length === 0) {
        return (_jsx("div", { className: "small text-danger", children: "This component has no options defined yet." }));
    }
    const valueLabel = fieldData?._rankingComponentKey ? 'Rank' : 'Value';
    return (_jsxs("div", { children: [_jsx("div", { className: "small text-muted mb-1", children: valueLabel }), _jsx("div", { className: "d-flex flex-wrap gap-1 align-items-center", style: { maxWidth: '400px' }, children: surveyValues.map(opt => {
                    const key = opt.value ?? opt.name ?? opt.label;
                    const isOn = selectedValues.includes(key);
                    return (_jsx("button", { type: "button", className: `btn btn-sm${isOn ? ' btn-primary' : ' btn-outline-secondary'}`, "aria-pressed": isOn, onClick: () => toggle(key), disabled: disabled, children: opt.label }, key));
                }) })] }));
}

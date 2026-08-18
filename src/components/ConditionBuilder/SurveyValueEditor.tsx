import type { ValueEditorProps } from 'react-querybuilder';
import { ValueEditor } from 'react-querybuilder';

type SurveyOption = { name?: string; value?: string; label: string };

export default function SurveyValueEditor(props: ValueEditorProps) {
    const { fieldData, value, handleOnChange, disabled } = props;

    // This editor emits an array, so single-valued fields (checkbox options included)
    // must keep the stock one or they end up as {"==": [.., ["true"]]}.
    if (fieldData?.valueEditorType !== 'multiselect') {
        return <ValueEditor {...props} />;
    }

    const surveyValues = (fieldData?.values ?? []) as SurveyOption[];
    // QueryBuilder and parseJsonLogic both run with listsAsArrays, so this is an array.
    const selectedValues: string[] = Array.isArray(value) ? value : [];

    const toggle = (v: string) => {
        if (disabled) return;
        const next = selectedValues.includes(v)
            ? selectedValues.filter(x => x !== v)
            : [...selectedValues, v];
        handleOnChange(next);
    };

    if (surveyValues.length === 0) {
        return (
            <div className="small text-danger">
                This component has no options defined yet.
            </div>
        );
    }

    const valueLabel = (fieldData as any)?._rankingComponentKey ? 'Rank' : 'Value';

    return (
        <div>
            <div className="small text-muted mb-1">{valueLabel}</div>
            <div
                className="d-flex flex-wrap gap-1 align-items-center"
                style={{ maxWidth: '400px' }}
            >
            {surveyValues.map(opt => {
                const key = opt.value ?? opt.name ?? opt.label;
                const isOn = selectedValues.includes(key);
                return (
                    <button
                        key={key}
                        type="button"
                        className={`btn btn-sm${isOn ? ' btn-primary' : ' btn-outline-secondary'}`}
                        aria-pressed={isOn}
                        onClick={() => toggle(key)}
                        disabled={disabled}
                    >
                        {opt.label}
                    </button>
                );
            })}
            </div>
        </div>
    );
}

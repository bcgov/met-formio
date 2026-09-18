import { expect } from 'chai';
import { Constants } from '../../src/components/Common/Constants';
import surveyEditData from '../../src/components/SimpleSurvey/editForm/Component.edit.data';

const valuesGrid = (surveyEditData as any[]).find((c) => c.type === 'datagrid' && c.key === 'values');
const classification = valuesGrid?.components?.find((c: any) => c.key === 'classification');

/** Run a formio `validate.custom` string the way formio does: it reads `valid` after evaluating. */
const runCustom = (custom: string, input: unknown, data: unknown) =>
    // eslint-disable-next-line no-new-func
    new Function('input', 'data', 'row', `var valid = true; ${custom}; return valid;`)(input, data, {});

describe('SimpleSurvey values / classification', () => {
    it('defines the eight classifications in rank order', () => {
        expect(Constants.LIKERT_CLASSIFICATIONS.map((c) => c.value)).to.deep.equal([
            'neg3', 'neg2', 'neg1', 'neutral', 'pos1', 'pos2', 'pos3', 'notSure',
        ]);
        expect(Constants.LIKERT_CLASSIFICATIONS.map((c) => c.label)).to.deep.equal([
            'Negative 3', 'Negative 2', 'Negative 1', 'Neutral',
            'Positive 1', 'Positive 2', 'Positive 3', 'Not sure',
        ]);
    });

    it('adds a required Classification select between Value and Tooltip', () => {
        const keys = valuesGrid.components.map((c: any) => c.key);
        expect(keys).to.deep.equal(['label', 'value', 'classification', 'tooltip']);
        expect(classification.type).to.equal('select');
        expect(classification.label).to.equal('Classification');
        expect(classification.validate.required).to.equal(true);
        expect(classification.data.values).to.deep.equal(Constants.LIKERT_CLASSIFICATIONS);
    });

    describe('duplicate check', () => {
        const custom = () => classification.validate.custom as string;
        const data = (...classes: string[]) => ({ values: classes.map((c) => ({ classification: c })) });

        it('fails when another row has the same classification', () => {
            expect(runCustom(custom(), 'neg1', data('neg1', 'neutral', 'neg1'))).to.equal(
                Constants.LIKERT_DUPLICATE_CLASSIFICATION_MESSAGE,
            );
        });

        it('passes when the classification is unique', () => {
            expect(runCustom(custom(), 'neg1', data('neg1', 'neutral', 'pos1'))).to.equal(true);
        });

        it('passes an empty selection, which the required rule reports instead', () => {
            expect(runCustom(custom(), '', data('', ''))).to.equal(true);
        });
    });

    it('sets validate.maxLength to 8, which hides Add Another once the grid holds 8 rows', () => {
        // NestedArrayComponent.hasAddButton() compares the row count to validate.maxLength to decide
        // whether to show "+ Add Another". formio core's own validateMaximumLength only validates
        // strings, so this setting does not reject a 9th row on a datagrid - it only hides the button.
        expect(Constants.LIKERT_MAX_VALUES).to.equal(8);
        expect(valuesGrid.validate.maxLength).to.equal(Constants.LIKERT_MAX_VALUES);
    });

    it('starts a new Likert on the standard 5-point scale', () => {
        expect(Constants.LIKERT_DEFAULT_VALUES).to.deep.equal(
            ['neg2', 'neg1', 'neutral', 'pos1', 'pos2'].map((c) => ({ label: '', value: '', classification: c })),
        );
        expect(valuesGrid.defaultValue).to.deep.equal(Constants.LIKERT_DEFAULT_VALUES);
    });

    it('explains the default scale in the help text', () => {
        const help = (surveyEditData as any[]).find((c) => c.key === 'likertScaleHelp');
        expect(help.html).to.contain(
            'This scale defaults to the standard 5-point classification: 2 negative, 1 neutral, 2 positive. ' +
                "Edit each row's classification if this survey needs a different scale.",
        );
        expect(help.html).to.not.contain('fixed to a 5-point scale');
    });
});

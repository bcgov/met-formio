import { expect } from 'chai';
import { Constants } from '../../src/components/Common/Constants';
import surveyEditData from '../../src/components/SimpleSurvey/editForm/Component.edit.data';
import checkboxesEditData from '../../src/components/SimpleCheckboxes/editForm/Component.edit.data';
import categoryCheckboxesEditData from '../../src/components/CategoryCheckboxes/editForm/Component.edit.data';

const datagrid = (editData: any[], key: string) =>
    editData.find((c) => c.type === 'datagrid' && c.key === key);

const child = (grid: any, key: string) =>
    grid?.components?.find((c: any) => c.key === key);

/** Formio's validateRegexPattern builds `new RegExp('^' + pattern + '$')`. */
const accepts = (pattern: string, value: string) => new RegExp(`^${pattern}$`).test(value);

describe('Value validation / no periods in data-path values', () => {
    describe('the pattern itself', () => {
        it('rejects values containing a period', () => {
            for (const value of ['q.one', '.leading', 'trailing.', 'a.b.c']) {
                expect(accepts(Constants.NO_PERIOD_PATTERN, value), value).to.equal(false);
            }
        });

        it('accepts ordinary values, including camelCased labels', () => {
            for (const value of ['qOne', 'easeOfUse', 'q_1', 'q-1', 'CCs', '']) {
                expect(accepts(Constants.NO_PERIOD_PATTERN, value), value).to.equal(true);
            }
        });

        it('is unanchored, since formio anchors it', () => {
            // note: the '^' in [^.] is class negation, not an anchor
            expect(Constants.NO_PERIOD_PATTERN.startsWith('^')).to.equal(false);
            expect(Constants.NO_PERIOD_PATTERN.endsWith('$')).to.equal(false);
        });
    });

    describe('fields that become part of a data path', () => {
        const cases: Array<[string, any, string]> = [
            ['SimpleSurvey questions', datagrid(surveyEditData, 'questions'), 'value'],
            ['SimpleCheckboxes values', datagrid(checkboxesEditData, 'values'), 'value'],
            ['CategoryCheckboxes values', datagrid(categoryCheckboxesEditData, 'values'), 'value'],
        ];

        cases.forEach(([label, grid, key]) => {
            it(`${label} rejects a period`, () => {
                const component = child(grid, key);
                expect(component, `${label} -> ${key} should exist`).to.not.equal(undefined);
                expect(component.validate.pattern).to.equal(Constants.NO_PERIOD_PATTERN);
                expect(component.errors.pattern).to.equal(Constants.NO_PERIOD_VALIDATION_MESSAGE);
            });

            it(`${label} keeps its auto-generated camelCase value`, () => {
                // _camelCase strips periods, so the default path never trips the rule.
                expect(child(grid, key).calculateValue).to.deep.equal({
                    _camelCase: [{ var: 'row.label' }],
                });
            });
        });
    });

    describe('fields that are only ever compared as values', () => {
        it('leaves radio and select option values unrestricted', () => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const radios = require('../../src/components/SimpleRadios/editForm/Component.edit.data').default;
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const select = require('../../src/components/SimpleSelect/editForm/Component.edit.data').default;
            for (const [label, editData] of [['SimpleRadios', radios], ['SimpleSelect', select]] as any[]) {
                const grid = editData.find((c: any) => c.type === 'datagrid' && c.key === 'data.values')
                    || datagrid(editData, 'values');
                const value = child(grid, 'value');
                expect(value?.validate?.pattern, label).to.equal(undefined);
            }
        });

        it('leaves survey answer values unrestricted', () => {
            // e.g. "Yes, always." is legitimate and never a path segment
            const answerValue = child(datagrid(surveyEditData, 'values'), 'value');
            expect(answerValue.validate?.pattern).to.equal(undefined);
        });
    });
});

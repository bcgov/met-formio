import { expect } from 'chai';
import {
    buildFieldMeta,
    serializeQuery,
    serializeCompleteRules,
    isRuleComplete,
    pruneIncompleteRules,
    parseInitialQuery,
    toFormioJsonLogic,
    fromFormioJsonLogic,
    DATA_PREFIX,
} from '../../src/components/ConditionBuilder/logic';
import { getFields, group, evaluate } from './helpers';

const fields = getFields();
const meta = buildFieldMeta(fields);

const build = (rules: any[]) => serializeQuery(group(rules), meta);

describe('ConditionBuilder / logic', () => {
    describe('data. prefix', () => {
        it('roots every field reference at data., as formio evaluates against { data, row, form, _ }', () => {
            expect(DATA_PREFIX).to.equal('data.');
            expect(build([{ field: 'name', operator: '=', value: 'Sam' }])).to.deep.equal({
                and: [{ '==': [{ var: 'data.name' }, 'Sam'] }],
            });
        });

        it('matches real submission data', () => {
            const logic = build([{ field: 'name', operator: '=', value: 'Sam' }]);
            expect(evaluate(logic, { name: 'Sam' })).to.equal(true);
            expect(evaluate(logic, { name: 'Alex' })).to.equal(false);
        });

        it('does not prefix twice', () => {
            const once = toFormioJsonLogic({ '==': [{ var: 'name' }, 'x'] }, meta);
            expect(toFormioJsonLogic(once, meta)).to.deep.equal(once);
        });

        it('strips the prefix on the way back in', () => {
            expect(fromFormioJsonLogic({ '==': [{ var: 'data.name' }, 'x'] }, meta))
                .to.deep.equal({ '==': [{ var: 'name' }, 'x'] });
        });

        it('still reads values saved before the prefix existed', () => {
            const legacy = { in: [{ var: 'sv.q2' }, ['a']] };
            const { query } = parseInitialQuery(legacy, fields, meta);
            expect((query.rules[0] as any).field).to.equal('sv.q2');
        });
    });

    describe('empty checks', () => {
        const isEmpty = build([{ field: 'name', operator: 'null', value: null }]);
        const isNotEmpty = build([{ field: 'name', operator: 'notNull', value: null }]);

        it('treats an untouched field ("") as empty', () => {
            expect(evaluate(isEmpty, { name: '' })).to.equal(true);
            expect(evaluate(isNotEmpty, { name: '' })).to.equal(false);
        });

        it('treats a missing field as empty', () => {
            expect(evaluate(isEmpty, {})).to.equal(true);
        });

        it('treats an answered field as not empty', () => {
            expect(evaluate(isEmpty, { name: 'Sam' })).to.equal(false);
            expect(evaluate(isNotEmpty, { name: 'Sam' })).to.equal(true);
        });
    });

    describe('checkboxes', () => {
        it('compares against booleans, which is what selectboxes stores', () => {
            const checked = build([{ field: 'cb.trails', operator: '=', value: 'true' }]);
            expect(checked).to.deep.equal({ and: [{ '==': [{ var: 'data.cb.trails' }, true] }] });
            expect(evaluate(checked, { cb: { trails: true } })).to.equal(true);
            expect(evaluate(checked, { cb: { trails: false } })).to.equal(false);
        });

        it('handles the unchecked case', () => {
            const unchecked = build([{ field: 'cb.trails', operator: '=', value: 'false' }]);
            expect(evaluate(unchecked, { cb: { trails: false } })).to.equal(true);
            expect(evaluate(unchecked, { cb: { trails: true } })).to.equal(false);
        });

        it('applies to categorycheckboxes too', () => {
            const logic = build([{ field: 'ccb.CCs', operator: '=', value: 'true' }]);
            expect(evaluate(logic, { ccb: { CCs: true } })).to.equal(true);
        });
    });

    describe('survey questions', () => {
        it('is one of', () => {
            const logic = build([{ field: 'sv.q2', operator: 'in', value: ['a'] }]);
            expect(logic).to.deep.equal({ and: [{ in: [{ var: 'data.sv.q2' }, ['a']] }] });
            expect(evaluate(logic, { sv: { q2: 'a' } })).to.equal(true);
            expect(evaluate(logic, { sv: { q2: 'd' } })).to.equal(false);
        });

        it('is not one of', () => {
            const logic = build([{ field: 'sv.q2', operator: 'notIn', value: ['a'] }]);
            expect(evaluate(logic, { sv: { q2: 'd' } })).to.equal(true);
            expect(evaluate(logic, { sv: { q2: 'a' } })).to.equal(false);
        });

        it('is not offered for a question value containing a dot', () => {
            // jsonLogic reads data.sv.q.one, so the question is unreachable.
            expect(fields.map((f) => f.name)).to.not.include('sv.q.one');
        });
    });

    describe('ranking statements', () => {
        const logic = build([{ field: 'rk.s2', operator: 'in', value: ['1'] }]);

        it('becomes a `some` over the parent component', () => {
            expect(logic).to.deep.equal({
                and: [{
                    some: [
                        { var: 'data.rk' },
                        {
                            and: [
                                { '===': [{ var: 'statementId' }, 's2'] },
                                { in: [{ var: 'rank' }, ['1', 1]] },
                            ],
                        },
                    ],
                }],
            });
        });

        it('leaves the row-scoped vars unprefixed, since `some` rebinds them', () => {
            const some = (logic as any).and[0].some[1].and;
            expect(some[0]['==='][0].var).to.equal('statementId');
            expect(some[1].in[0].var).to.equal('rank');
        });

        it('matches whether the rank is stored as a string or a number', () => {
            expect(evaluate(logic, { rk: [{ statementId: 's2', rank: '1' }] })).to.equal(true);
            expect(evaluate(logic, { rk: [{ statementId: 's2', rank: 1 }] })).to.equal(true);
        });

        it('does not match another statement holding that rank', () => {
            expect(evaluate(logic, { rk: [{ statementId: 's.1', rank: '1' }] })).to.equal(false);
        });

        it('does not match an unranked statement', () => {
            expect(evaluate(logic, { rk: [{ statementId: 's2', rank: '' }] })).to.equal(false);
        });

        it('supports "is not one of"', () => {
            const notIn = build([{ field: 'rk.s2', operator: 'notIn', value: ['1'] }]);
            expect(evaluate(notIn, { rk: [{ statementId: 's2', rank: '2' }] })).to.equal(true);
            expect(evaluate(notIn, { rk: [{ statementId: 's2', rank: '1' }] })).to.equal(false);
        });
    });

    describe('periods in comparison-position values', () => {
        // Compared, never used as a path, so the authoring-time rule deliberately skips them.
        it('works for a radio option value containing a period', () => {
            const logic = build([{ field: 'rad', operator: '=', value: 'q.one' }]);
            expect(logic).to.deep.equal({ and: [{ '==': [{ var: 'data.rad' }, 'q.one'] }] });
            expect(evaluate(logic, { rad: 'q.one' })).to.equal(true);
            expect(evaluate(logic, { rad: 'q2' })).to.equal(false);
        });

        it('works for a survey answer value containing a period', () => {
            const logic = build([{ field: 'sv.q2', operator: 'in', value: ['yes.always'] }]);
            expect(evaluate(logic, { sv: { q2: 'yes.always' } })).to.equal(true);
            expect(evaluate(logic, { sv: { q2: 'a' } })).to.equal(false);
        });

        it('works for a ranking statement id containing a period', () => {
            const logic = build([{ field: 'rk.s.1', operator: 'in', value: ['1'] }]);
            expect(evaluate(logic, { rk: [{ statementId: 's.1', rank: '1' }] })).to.equal(true);
            expect(evaluate(logic, { rk: [{ statementId: 's2', rank: '1' }] })).to.equal(false);
        });

        it('round-trips all three unchanged', () => {
            const cases = [
                [{ field: 'rad', operator: '=', value: 'q.one' }],
                [{ field: 'sv.q2', operator: 'in', value: ['yes.always'] }],
                [{ field: 'rk.s.1', operator: 'in', value: ['1'] }],
            ];
            for (const rules of cases) {
                const saved = build(rules);
                const { query, lossy } = parseInitialQuery(saved, fields, meta);
                expect(lossy, JSON.stringify(rules)).to.equal(false);
                expect(serializeQuery(query, meta)).to.deep.equal(saved);
            }
        });
    });

    describe('combinators', () => {
        it('supports and / or across mixed component types', () => {
            const logic = serializeQuery({
                combinator: 'or',
                rules: [
                    { field: 'name', operator: '=', value: 'Sam' },
                    { combinator: 'and', rules: [
                        { field: 'sv.q2', operator: 'in', value: ['a'] },
                        { field: 'rk.s2', operator: 'in', value: ['1'] },
                    ] },
                ],
            } as any, meta);

            expect(evaluate(logic, { name: 'Sam' })).to.equal(true);
            expect(evaluate(logic, {
                name: 'Alex', sv: { q2: 'a' }, rk: [{ statementId: 's2', rank: '1' }],
            })).to.equal(true);
            expect(evaluate(logic, { name: 'Alex', sv: { q2: 'a' } })).to.equal(false);
        });
    });

    describe('incomplete rules', () => {
        it('treats a rule with no value as incomplete', () => {
            expect(isRuleComplete({ field: 'name', operator: '=', value: '' })).to.equal(false);
            expect(isRuleComplete({ field: 'name', operator: '=', value: undefined })).to.equal(false);
            expect(isRuleComplete({ field: 'sv.q2', operator: 'in', value: [] })).to.equal(false);
            expect(isRuleComplete({ field: '', operator: '=', value: 'x' })).to.equal(false);
        });

        it('treats is empty / is not empty as complete without a value', () => {
            expect(isRuleComplete({ field: 'name', operator: 'null', value: null })).to.equal(true);
            expect(isRuleComplete({ field: 'name', operator: 'notNull', value: null })).to.equal(true);
        });

        it('treats a filled rule as complete', () => {
            expect(isRuleComplete({ field: 'name', operator: '=', value: 'Sam' })).to.equal(true);
            expect(isRuleComplete({ field: 'sv.q2', operator: 'in', value: ['a'] })).to.equal(true);
            expect(isRuleComplete({ field: 'cb.trails', operator: '=', value: 'false' })).to.equal(true);
        });

        it('is not persisted, but the finished rules alongside it are', () => {
            const q = group([
                { field: 'name', operator: '=', value: 'Sam' },
                { field: 'notes', operator: '=', value: '' },
            ]);
            expect(serializeCompleteRules(q, meta)).to.deep.equal({
                and: [{ '==': [{ var: 'data.name' }, 'Sam'] }],
            });
        });

        it('persists nothing when every rule is unfinished', () => {
            const q = group([{ field: 'name', operator: '=', value: '' }]);
            expect(serializeCompleteRules(q, meta)).to.equal(null);
        });

        it('drops a group left empty once its unfinished rules are removed', () => {
            const q = {
                combinator: 'and',
                rules: [
                    { field: 'name', operator: '=', value: 'Sam' },
                    { combinator: 'or', rules: [{ field: 'notes', operator: '=', value: '' }] },
                ],
            } as any;
            expect(serializeCompleteRules(q, meta)).to.deep.equal({
                and: [{ '==': [{ var: 'data.name' }, 'Sam'] }],
            });
        });

        it('leaves the query itself untouched, so the rule stays editable', () => {
            const q = group([{ field: 'name', operator: '=', value: '' }]);
            const before = JSON.stringify(q);
            pruneIncompleteRules(q);
            expect(JSON.stringify(q)).to.equal(before);
        });
    });

    describe('serializeQuery', () => {
        it('returns null for an empty query so formio treats the component as unconditional', () => {
            expect(serializeQuery(group([]), meta)).to.equal(null);
            expect(serializeQuery(null, meta)).to.equal(null);
        });
    });

    describe('round trips', () => {
        const cases: Array<[string, any[]]> = [
            ['text equals', [{ field: 'name', operator: '=', value: 'Sam' }]],
            ['contains', [{ field: 'notes', operator: 'contains', value: 'hi' }]],
            ['does not contain', [{ field: 'notes', operator: 'doesNotContain', value: 'hi' }]],
            ['is empty', [{ field: 'name', operator: 'null', value: null }]],
            ['is not empty', [{ field: 'name', operator: 'notNull', value: null }]],
            ['select', [{ field: 'region', operator: '=', value: 'n' }]],
            ['checkbox', [{ field: 'cb.trails', operator: '=', value: 'true' }]],
            ['survey in', [{ field: 'sv.q2', operator: 'in', value: ['a', 'd'] }]],
            ['survey notIn', [{ field: 'sv.q2', operator: 'notIn', value: ['a'] }]],
            ['ranking with a dotted statement id', [{ field: 'rk.s.1', operator: 'in', value: ['1'] }]],
            ['ranking', [{ field: 'rk.s.1', operator: 'in', value: ['1', '2'] }]],
            ['multiple rules', [
                { field: 'name', operator: '=', value: 'Sam' },
                { field: 'rk.s2', operator: 'in', value: ['1'] },
            ]],
        ];

        cases.forEach(([label, rules]) => {
            it(`${label} survives save -> load -> save unchanged`, () => {
                const saved = build(rules);
                const { query, lossy } = parseInitialQuery(saved, fields, meta);
                expect(lossy, 'should not be reported as lossy').to.equal(false);
                expect(serializeQuery(query, meta)).to.deep.equal(saved);
            });
        });

        it('preserves the selected values, not a comma-joined string', () => {
            const saved = build([{ field: 'sv.q2', operator: 'in', value: ['a', 'd'] }]);
            const { query } = parseInitialQuery(saved, fields, meta);
            expect((query.rules[0] as any).value).to.deep.equal(['a', 'd']);
        });
    });

    describe('parseInitialQuery', () => {
        it('treats no value as an empty, non-lossy query', () => {
            for (const empty of [null, undefined, {}, '']) {
                const result = parseInitialQuery(empty, fields, meta);
                expect(result.query.rules).to.have.length(0);
                expect(result.lossy).to.equal(false);
            }
        });

        it('flags hand-written logic it cannot represent', () => {
            const handWritten = { and: [{ '>': [{ var: 'data.a' }, 3] }, { cat: ['x'] }] };
            expect(parseInitialQuery(handWritten, fields, meta).lossy).to.equal(true);
        });

        it('flags a reference to a component that no longer exists', () => {
            const stale = { '==': [{ var: 'data.deletedField' }, 'x'] };
            const result = parseInitialQuery(stale, fields, meta);
            expect(result.lossy).to.equal(true);
            expect(result.query.rules).to.have.length(0);
        });

        it('flags a ranking condition whose component was deleted', () => {
            const saved = build([{ field: 'rk.s2', operator: 'in', value: ['1'] }]);
            const withoutRanking = fields.filter((f) => !String(f.name).startsWith('rk.'));
            const result = parseInitialQuery(saved, withoutRanking, buildFieldMeta(withoutRanking));
            expect(result.lossy).to.equal(true);
        });

        it('does not throw on malformed input', () => {
            expect(() => parseInitialQuery({ '??': 'nonsense' }, fields, meta)).to.not.throw();
        });
    });
});

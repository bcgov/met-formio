import { expect } from 'chai';
import { getFields, field, EDIT_FORM } from './helpers';

describe('ConditionBuilder / _getFields', () => {
    const fields = getFields();
    const names = fields.map((f) => f.name as string);

    it('excludes display-only components', () => {
        for (const key of ['hdr', 'para', 'cont', 'html']) {
            expect(names).to.not.include(key);
        }
    });

    it('excludes containers but keeps the components inside them', () => {
        expect(names).to.not.include('ccc');
        expect(names).to.include('inner');
    });

    it('excludes the component currently being edited', () => {
        expect(names).to.not.include('edited');
        expect(names).to.not.include('conditional.json');
    });

    it('offers text operators for plain inputs', () => {
        const operators = (field(fields, 'name') as any).operators.map((o: any) => o.name);
        expect(operators).to.deep.equal(['=', '!=', 'contains', 'doesNotContain', 'null', 'notNull']);
    });

    it('offers the defined values for a select', () => {
        const region = field(fields, 'region') as any;
        expect(region.valueEditorType).to.equal('select');
        expect(region.values.map((v: any) => v.value)).to.deep.equal(['n', 's']);
    });

    it('expands a survey into one field per question, keyed with the parent', () => {
        expect(names).to.include('sv.q2');
        const q2 = field(fields, 'sv.q2') as any;
        expect(q2._parentKey).to.equal('sv');
        expect(q2.valueEditorType).to.equal('multiselect');
        expect(q2.values.map((v: any) => v.value)).to.deep.equal(['a', 'd', 'yes.always']);
    });

    it('omits question values containing a dot, which jsonLogic cannot address', () => {
        expect(names).to.not.include('sv.q.one');
    });

    it('expands a ranking into one field per statement, with a rank per position', () => {
        const s1 = field(fields, 'rk.s.1') as any;
        expect(s1._rankingComponentKey).to.equal('rk');
        expect(s1._statementId).to.equal('s.1');
        // two statements, so ranks 1 and 2
        expect(s1.values.map((v: any) => v.value)).to.deep.equal(['1', '2']);
    });

    it('tags every selectboxes-derived option as boolean', () => {
        for (const name of ['cb.trails', 'cb.water', 'ccb.CCs']) {
            expect((field(fields, name) as any)?._booleanValue, name).to.equal(true);
        }
    });

    it('returns an empty list rather than throwing when there is no form', () => {
        expect(getFields(null)).to.deep.equal([]);
        expect(getFields({} as any)).to.deep.equal([]);
        expect(getFields({ components: null } as any)).to.deep.equal([]);
    });

    it('does not mutate the form it reads', () => {
        const before = JSON.stringify(EDIT_FORM);
        getFields();
        expect(JSON.stringify(EDIT_FORM)).to.equal(before);
    });
});

import { expect } from 'chai';
import { Formio, Webform } from '@formio/js';
import { fastCloneDeep } from '@formio/js/utils';
import createSimpleSurvey from '../../src/components/SimpleSurvey/Component';

const Component = createSimpleSurvey() as any;

const STANDARD_SCALE = ['neg2', 'neg1', 'neutral', 'pos1', 'pos2'];

/**
 * Loads a component JSON into the Likert edit form the way WebformBuilder.editComponent does:
 * the real editForm() schema, a component instance built from a copy of the JSON, and that
 * instance's component as the submission data, rendered and attached in jsdom.
 */
async function openEditForm(componentJson: Record<string, unknown>) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    // The builder passes the form being built as options.editForm; edit-form conditions read it.
    const editForm = new (Webform as any)({ noAlerts: true, editForm: { components: [componentJson] } });
    editForm.form = Component.editForm();
    const instance = new Component(fastCloneDeep(componentJson), { inFormBuilder: true });
    editForm.submission = { data: instance.component };
    await editForm.formReady;
    container.innerHTML = editForm.render();
    await editForm.attach(container);
    await editForm.submissionReady;
    return { editForm, container };
}

describe('SimpleSurvey edit form', () => {
    let opened: { editForm: any; container: HTMLElement } | undefined;

    // The edit form's code editors (textarea `editor: 'ace'`) ask Formio.requireLibrary for ace,
    // which polls window.ace every 200ms forever when the CDN script never loads, keeping mocha
    // alive. A pending library entry makes requireLibrary wait without polling; the editors are
    // not under test.
    before(() => {
        (Formio as any).libraries.ace = { ready: new Promise(() => undefined) };
    });

    after(() => {
        delete (Formio as any).libraries.ace;
    });

    afterEach(() => {
        // Not destroy(): tippy tooltips call cancelAnimationFrame on teardown, which jsdom lacks.
        opened?.container.remove();
        opened = undefined;
    });

    const valuesRows = () => opened!.editForm.getComponent('values').dataValue;

    it('fills the values grid of a newly dragged-in Likert with the standard 5-point scale', async () => {
        opened = await openEditForm(Component.builderInfo.schema);
        const rows = valuesRows();
        expect(rows.map((r: any) => r.classification)).to.deep.equal(STANDARD_SCALE);
        rows.forEach((r: any) => {
            expect(r.label).to.equal('');
            expect(r.value).to.equal('');
        });
    });

    it('keeps the rows of a saved legacy Likert unclassified', async () => {
        const legacyValues = ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'].map(
            (label, i) => ({ label, value: String(i + 1), tooltip: '' }),
        );
        opened = await openEditForm({
            type: 'simplesurvey',
            key: 'legacyLikert',
            label: 'Legacy Likert',
            questions: [{ label: 'Q1', value: 'q1' }],
            values: legacyValues,
        });
        const rows = valuesRows();
        expect(rows.map((r: any) => r.label)).to.deep.equal(legacyValues.map((v) => v.label));
        expect(rows.map((r: any) => r.value)).to.deep.equal(legacyValues.map((v) => v.value));
        rows.forEach((r: any) => expect(r.classification || '').to.equal(''));
    });

    it('adds no default values to the static schema', () => {
        expect(Component.schema().values).to.deep.equal([]);
    });
});

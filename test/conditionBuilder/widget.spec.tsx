import { expect } from 'chai';
import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { act } from 'react';
import { dom } from '../setup';
import ConditionBuilderWidget, { Conflict } from '../../src/components/ConditionBuilder/ConditionBuilderWidget';
import { buildFieldMeta, serializeQuery } from '../../src/components/ConditionBuilder/logic';
import { getFields, group } from './helpers';

const fields = getFields();
const meta = buildFieldMeta(fields);
const build = (rules: any[]) => serializeQuery(group(rules), meta);

interface Mounted {
    el: HTMLElement;
    emitted: any[];
    click(el: Element | undefined): Promise<void>;
    buttons(text: RegExp): HTMLButtonElement[];
    text(): string;
}

const roots: Root[] = [];

async function mount(initialValue: any, conflict: Conflict = null): Promise<Mounted> {
    const emitted: any[] = [];
    const el = dom.window.document.createElement('div');
    dom.window.document.body.appendChild(el);
    const root = createRoot(el);
    roots.push(root);

    await act(async () => {
        root.render(React.createElement(ConditionBuilderWidget, {
            fields, initialValue, conflict, onChange: (v: any) => emitted.push(v),
        }));
    });

    return {
        el: el as any,
        emitted,
        async click(target) {
            if (!target) throw new Error('element to click was not found');
            await act(async () => {
                target.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
            });
        },
        buttons(text) {
            return [...el.querySelectorAll('button')].filter((b) => text.test(b.textContent || '')) as any;
        },
        text: () => el.textContent || '',
    };
}

afterEach(async () => {
    await act(async () => {
        roots.splice(0).forEach((root) => root.unmount());
    });
});

const fieldSelect = (el: HTMLElement) =>
    [...el.querySelectorAll('select')].find((s) => /-component$/.test(s.id)) as HTMLSelectElement;

describe('ConditionBuilder / widget', () => {
    describe('does not write to the form on mount', () => {
        it('stays silent for a value it authored itself', async () => {
            const saved = build([{ field: 'sv.q2', operator: 'in', value: ['a'] }]);
            const { emitted } = await mount(saved);
            expect(emitted).to.have.length(0);
        });

        it('stays silent, and warns, for hand-written logic it cannot display', async () => {
            const handWritten = { and: [{ '>': [{ var: 'data.a' }, 3] }, { cat: ['x'] }] };
            const { emitted, text } = await mount(handWritten);
            expect(emitted, 'must not overwrite logic it cannot represent').to.have.length(0);
            expect(text()).to.match(/cannot\s+display/);
        });

        it('stays silent for an empty condition', async () => {
            const { emitted } = await mount(null);
            expect(emitted).to.have.length(0);
        });
    });

    describe('user edits', () => {
        it('does not emit a half-built rule when one is added', async () => {
            const m = await mount(null);
            await m.click(m.buttons(/\+ ?rule/i)[0]);
            expect(m.emitted, 'an unfinished rule must not reach the schema').to.have.length(0);
            // but it is still on screen, waiting to be filled in
            expect(m.el.querySelectorAll('.rule')).to.have.length(1);
        });

        it('emits once the new rule is actually filled in', async () => {
            const m = await mount(null);
            await m.click(m.buttons(/\+ ?rule/i)[0]);

            const select = fieldSelect(m.el);
            await act(async () => {
                select.value = 'sv';
                select.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
            });
            expect(m.emitted, 'still no value chosen').to.have.length(0);

            await m.click(m.buttons(/^Agree$/)[0]);
            expect(m.emitted).to.have.length(1);
            expect(JSON.stringify(m.emitted[0])).to.contain('data.sv.q2');
        });

        it('emits null when everything is cleared', async () => {
            const saved = build([{ field: 'name', operator: '=', value: 'Sam' }]);
            const m = await mount(saved);
            await m.click(m.buttons(/clear all/i)[0]);
            expect(m.emitted).to.deep.equal([null]);
        });

        it('hides Clear all once there is nothing left to clear', async () => {
            const saved = build([{ field: 'name', operator: '=', value: 'Sam' }]);
            const m = await mount(saved);
            expect(m.buttons(/clear all/i)).to.have.length(1);
            await m.click(m.buttons(/clear all/i)[0]);
            expect(m.buttons(/clear all/i)).to.have.length(0);
            expect(m.emitted).to.have.length(1);
        });
    });

    describe('field selector', () => {
        it('commits the first sub-question when a survey is picked', async () => {
            const m = await mount(null);
            await m.click(m.buttons(/\+ ?rule/i)[0]);

            const select = fieldSelect(m.el);
            await act(async () => {
                select.value = 'sv';
                select.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
            });

            // q.one is unaddressable, so q2 is the first offered sub-question
            const options = [...m.el.querySelectorAll('[role="option"]')];
            expect(options.find((o) => o.getAttribute('aria-selected') === 'true')?.textContent)
                .to.equal('Speed');
        });

        it('lists the sub-questions of the selected parent', async () => {
            const m = await mount(build([{ field: 'sv.q2', operator: 'in', value: ['a'] }]));
            const options = [...m.el.querySelectorAll('[role="option"]')];
            expect(options.map((o) => o.textContent)).to.deep.equal(['Speed', 'Support']);
            expect(options.find((o) => o.getAttribute('aria-selected') === 'true')?.textContent)
                .to.equal('Speed');
        });

        it('shows a plain field without a sub-question list', async () => {
            const m = await mount(build([{ field: 'name', operator: '=', value: 'Sam' }]));
            expect(m.el.querySelectorAll('[role="option"]')).to.have.length(0);
            expect(fieldSelect(m.el).value).to.equal('name');
        });
    });

    describe('value editor', () => {
        it('uses toggle buttons for a multi-select survey field', async () => {
            const m = await mount(build([{ field: 'sv.q2', operator: 'in', value: ['a'] }]));
            const toggles = m.buttons(/^(Agree|Disagree)$/);
            expect(toggles).to.have.length(2);
            expect(toggles.find((b) => b.textContent === 'Agree')!.getAttribute('aria-pressed'))
                .to.equal('true');
        });

        it('adds and removes selections', async () => {
            const m = await mount(build([{ field: 'sv.q2', operator: 'in', value: ['a'] }]));
            await m.click(m.buttons(/^Disagree$/)[0]);
            expect((m.emitted[m.emitted.length - 1] as any).and[0].in[1]).to.deep.equal(['a', 'd']);

            await m.click(m.buttons(/^Agree$/)[0]);
            expect((m.emitted[m.emitted.length - 1] as any).and[0].in[1]).to.deep.equal(['d']);
        });

        it('leaves checkbox fields on the stock scalar editor', async () => {
            const m = await mount(build([{ field: 'cb.trails', operator: '=', value: 'true' }]));
            // the toggle-button editor would render buttons instead of a <select>
            expect(m.buttons(/^(checked|unchecked)$/)).to.have.length(0);
            const selects = [...m.el.querySelectorAll('select')];
            expect(selects.some((s) => [...s.options].some((o) => o.text === 'checked'))).to.equal(true);
        });
    });

    describe('warnings', () => {
        it('warns when the simple conditional takes precedence', async () => {
            const m = await mount(null, 'simple');
            expect(m.text()).to.match(/not being used/i);
            expect(m.text()).to.match(/Simple/);
        });

        it('warns when custom javascript takes precedence', async () => {
            const m = await mount(null, 'custom');
            expect(m.text()).to.match(/not being used/i);
            expect(m.text()).to.match(/Advanced Conditions/);
        });

        it('shows no warning when conditional.json is what formio will use', async () => {
            const m = await mount(null);
            expect(m.text()).to.not.match(/not being used/i);
        });
    });

    describe('empty form', () => {
        it('explains that there is nothing to build a condition from', async () => {
            const el = dom.window.document.createElement('div');
            dom.window.document.body.appendChild(el);
            const root = createRoot(el);
            roots.push(root);
            await act(async () => {
                root.render(React.createElement(ConditionBuilderWidget, {
                    fields: [], initialValue: null, onChange: () => undefined,
                }));
            });
            expect(el.textContent).to.match(/No form components are available/);
        });
    });
});

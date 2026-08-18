import { jsonLogic } from '@formio/core';
import type { Field, RuleGroupType } from 'react-querybuilder';
import getComponents from '../../src/components';

/** Every component type the condition builder reasons about, dotted keys included. */
export const EDIT_FORM = {
    components: [
        { type: 'header', key: 'hdr', label: 'Heading', input: false },
        { type: 'paragraph', key: 'para', label: 'Intro', input: false },
        { type: 'simplecontent', key: 'cont', label: 'Content', input: false },
        { type: 'simplehtmlelement', key: 'html', label: 'Markup', input: false },

        { type: 'simpletextfield', key: 'name', label: 'Your name', input: true },
        { type: 'simpletextarea', key: 'notes', label: 'Notes', input: true },

        {
            type: 'simpleselect', key: 'region', label: 'Region', input: true,
            values: [{ label: 'North', value: 'n' }, { label: 'South', value: 's' }],
        },
        {
            type: 'simpleradios', key: 'rad', label: 'Preference', input: true,
            values: [{ label: 'Option one', value: 'q.one' }, { label: 'Option two', value: 'q2' }],
        },
        {
            type: 'simplecheckboxes', key: 'cb', label: 'Interests', input: true,
            values: [{ label: 'Trails', value: 'trails' }, { label: 'Water', value: 'water' }],
        },
        {
            type: 'categorycheckboxes', key: 'ccb', label: 'Categories', input: true,
            values: [{ label: 'Category Components', value: 'CCs' }],
        },
        {
            type: 'categorycommentcontainer', key: 'ccc', label: 'Container', input: true,
            components: [{ type: 'categorytextarea', key: 'inner', label: 'Inner', input: true }],
        },
        {
            type: 'simplesurvey', key: 'sv', label: 'Satisfaction', input: true,
            // deliberately contains a dot
            questions: [
                { label: 'Ease of use', value: 'q.one' },
                { label: 'Speed', value: 'q2' },
                { label: 'Support', value: 'q3' },
            ],
            values: [
                { label: 'Agree', value: 'a' },
                { label: 'Disagree', value: 'd' },
                { label: 'Yes, always.', value: 'yes.always' },
            ],
        },
        {
            type: 'simpleranking', key: 'rk', label: 'Priorities', input: true,
            // deliberately contains a dot
            statements: [{ id: 's.1', label: 'Cost' }, { id: 's2', label: 'Speed' }],
        },
    ],
} as any;

/** Invokes the real _getFields() against EDIT_FORM without booting a form builder. */
export function getFields(editForm: any = EDIT_FORM): Field[] {
    const ConditionBuilder = getComponents().conditionbuilder;
    return ConditionBuilder.prototype._getFields.call({
        root: { options: { editForm }, data: { key: 'edited' } },
        component: { key: 'conditional.json' },
    });
}

export const field = (fields: Field[], name: string) =>
    fields.find((f) => f.name === name) as Field | undefined;

export const group = (rules: any[]): RuleGroupType =>
    ({ combinator: 'and', rules } as RuleGroupType);

/** Evaluates exactly as formio's checkJsonConditional does, context shape included. */
export const evaluate = (logic: any, data: any): unknown =>
    (jsonLogic as any).apply(logic, { data, row: {}, form: {}, _: require('lodash') });

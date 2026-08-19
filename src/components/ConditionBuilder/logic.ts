import _ from 'lodash';
import { formatQuery, RuleGroupType, Field } from 'react-querybuilder';
import { parseJsonLogic } from 'react-querybuilder/parseJsonLogic';

/**
 * Formio evaluates conditional.json as jsonLogic.apply(json, { data, row, form, _ }),
 * so field references must be rooted at `data.`. react-querybuilder emits bare names.
 */
export const DATA_PREFIX = 'data.';

export const EMPTY_QUERY: RuleGroupType = { combinator: 'and', rules: [] };

/** The two field kinds that need more than a straight name-to-path translation. */
export type FieldMeta =
    | { kind: 'ranking'; componentKey: string; statementId: string }
    | { kind: 'boolean' };

export function buildFieldMeta(fields: Field[]): Map<string, FieldMeta> {
    const meta = new Map<string, FieldMeta>();
    fields.forEach((field) => {
        const name = field.name as string;
        const componentKey = (field as any)._rankingComponentKey as string | undefined;
        const statementId = (field as any)._statementId as string | undefined;
        if (componentKey && statementId) {
            meta.set(name, { kind: 'ranking', componentKey, statementId });
        } else if ((field as any)._booleanValue) {
            meta.set(name, { kind: 'boolean' });
        }
    });
    return meta;
}

type VarNode = { var: string };

const varNode = (path: string): VarNode => ({ var: path });

const isVar = (node: any): node is VarNode =>
    !!node &&
    typeof node === 'object' &&
    !Array.isArray(node) &&
    typeof node.var === 'string' &&
    Object.keys(node).length === 1;

const addPrefix = (path: string) => (path.startsWith(DATA_PREFIX) ? path : `${DATA_PREFIX}${path}`);

// Tolerant of values written before the prefix was applied.
const stripPrefix = (path: string) => (path.startsWith(DATA_PREFIX) ? path.slice(DATA_PREFIX.length) : path);

const singleOp = (node: any): [string, any] | null => {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return null;
    const keys = Object.keys(node);
    return keys.length === 1 ? [keys[0], node[keys[0]]] : null;
};

const isPair = (args: any): args is [VarNode, any] =>
    Array.isArray(args) && args.length === 2 && isVar(args[0]);

/** An untouched formio field holds '', a missing path resolves to null — accept both. */
const emptyCheck = (field: string) => ({ in: [varNode(addPrefix(field)), [null, '']] });

const isEmptyCheckList = (values: any) =>
    Array.isArray(values) && values.length === 2 && values[0] === null && values[1] === '';

/** Ranks are strings today, but jsonLogic's `in` is strict, so match numbers too. */
const expandRankValues = (values: any) => {
    if (!Array.isArray(values)) return values;
    const numeric = values
        .filter((v) => typeof v === 'string' && v.trim() !== '')
        .map(Number)
        .filter((n) => Number.isFinite(n) && !values.includes(n));
    return [...values, ...numeric];
};

const collapseRankValues = (values: any) => {
    if (!Array.isArray(values)) return values;
    const strings = values.filter((v) => typeof v === 'string');
    return strings.length > 0 ? strings : values.map(String);
};

/**
 * SimpleRanking stores rows of { statementId, rank }, so a per-statement condition is a
 * `some` over the component. jsonLogic rescopes `var` inside it, so no prefix there.
 */
const rankingSome = (info: { componentKey: string; statementId: string }, values: any) => ({
    some: [
        varNode(addPrefix(info.componentKey)),
        {
            and: [
                { '===': [varNode('statementId'), info.statementId] },
                { in: [varNode('rank'), expandRankValues(values)] },
            ],
        },
    ],
});

const parseRankingSome = (componentKey: string, condition: any) => {
    if (!condition || typeof condition !== 'object' || !Array.isArray(condition.and)) return null;
    const statement = condition.and.find(
        (clause: any) => Array.isArray(clause?.['===']) && clause['==='][0]?.var === 'statementId',
    );
    const rank = condition.and.find(
        (clause: any) => Array.isArray(clause?.in) && clause.in[0]?.var === 'rank',
    );
    if (!statement || !rank) return null;
    return { in: [varNode(`${componentKey}.${statement['==='][1]}`), collapseRankValues(rank.in[1])] };
};

/** react-querybuilder JSONLogic -> the JSONLogic formio actually evaluates. */
export function toFormioJsonLogic(node: any, meta: Map<string, FieldMeta>): any {
    if (!node || typeof node !== 'object') return node;
    if (Array.isArray(node)) return node.map((item) => toFormioJsonLogic(item, meta));

    const op = singleOp(node);
    if (op) {
        const [operator, args] = op;

        if (operator === 'in' && isPair(args)) {
            const info = meta.get(args[0].var);
            if (info?.kind === 'ranking') return rankingSome(info, args[1]);
        }

        if ((operator === '==' || operator === '!=') && isPair(args)) {
            const field = args[0].var;
            const value = args[1];

            if (value === null) {
                const check = emptyCheck(field);
                return operator === '==' ? check : { '!': check };
            }

            if (meta.get(field)?.kind === 'boolean') {
                return { [operator]: [varNode(addPrefix(field)), value === true || value === 'true'] };
            }
        }
    }

    if (isVar(node)) return varNode(addPrefix(node.var));

    return _.mapValues(node, (value) => toFormioJsonLogic(value, meta));
}

/** The inverse of toFormioJsonLogic, so parseJsonLogic sees shapes it understands. */
export function fromFormioJsonLogic(node: any, meta: Map<string, FieldMeta>): any {
    if (!node || typeof node !== 'object') return node;
    if (Array.isArray(node)) return node.map((item) => fromFormioJsonLogic(item, meta));

    const op = singleOp(node);
    if (op) {
        const [operator, args] = op;

        if (operator === 'some' && isPair(args)) {
            const ranking = parseRankingSome(stripPrefix(args[0].var), args[1]);
            if (ranking) return ranking;
        }

        if (operator === 'in' && isPair(args) && isEmptyCheckList(args[1])) {
            return { '==': [varNode(stripPrefix(args[0].var)), null] };
        }

        if (operator === '!') {
            const innerOp = singleOp(args);
            if (innerOp && innerOp[0] === 'in' && isPair(innerOp[1]) && isEmptyCheckList(innerOp[1][1])) {
                return { '!=': [varNode(stripPrefix(innerOp[1][0].var)), null] };
            }
        }

        if ((operator === '==' || operator === '!=') && isPair(args) && typeof args[1] === 'boolean') {
            const field = stripPrefix(args[0].var);
            if (meta.get(field)?.kind === 'boolean') {
                return { [operator]: [varNode(field), String(args[1])] };
            }
        }
    }

    if (isVar(node)) return varNode(stripPrefix(node.var));

    return _.mapValues(node, (value) => fromFormioJsonLogic(value, meta));
}

const VALUELESS_OPERATORS = new Set(['null', 'notNull']);

/** react-querybuilder creates a rule on "+ Rule", before the author picks a value. */
export function isRuleComplete(rule: any): boolean {
    if (!rule || !rule.field || !rule.operator) return false;
    if (VALUELESS_OPERATORS.has(rule.operator)) return true;
    const { value } = rule;
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== '';
}

/** Drops unfinished rules, and any group left empty as a result. */
export function pruneIncompleteRules(group: RuleGroupType): RuleGroupType {
    const rules = (group.rules as any[])
        .map((rule) => (rule && Array.isArray(rule.rules) ? pruneIncompleteRules(rule) : rule))
        .filter((rule: any) =>
            rule && Array.isArray(rule.rules) ? rule.rules.length > 0 : isRuleComplete(rule),
        );
    return { ...group, rules } as RuleGroupType;
}

/** null when the query is empty, so formio treats the component as unconditional. */
export function serializeQuery(query: RuleGroupType | null, meta: Map<string, FieldMeta>): any {
    if (!query || query.rules.length === 0) return null;
    // Values are already arrays because QueryBuilder is configured with listsAsArrays.
    const raw = formatQuery(query, 'jsonlogic');
    if (!raw || typeof raw !== 'object') return null;
    return toFormioJsonLogic(raw, meta);
}

/** What gets persisted. Unfinished rules stay on screen, they just are not saved. */
export function serializeCompleteRules(query: RuleGroupType | null, meta: Map<string, FieldMeta>): any {
    if (!query) return null;
    return serializeQuery(pruneIncompleteRules(query), meta);
}

/** Collapse single-clause and/or wrappers so round-trip comparisons ignore them. */
function normalize(node: any): any {
    if (!node || typeof node !== 'object') return node;
    if (Array.isArray(node)) return node.map(normalize);
    const op = singleOp(node);
    if (op && (op[0] === 'and' || op[0] === 'or') && Array.isArray(op[1]) && op[1].length === 1) {
        return normalize(op[1][0]);
    }
    return _.mapValues(node, normalize);
}

export interface ParsedQuery {
    query: RuleGroupType;
    /** Stored logic the builder cannot reproduce. Callers must warn, not overwrite. */
    lossy: boolean;
}

export function parseInitialQuery(
    value: any,
    fields: Field[],
    meta: Map<string, FieldMeta>,
): ParsedQuery {
    if (!value || typeof value !== 'object' || Object.keys(value).length === 0) {
        return { query: EMPTY_QUERY, lossy: false };
    }

    let query: RuleGroupType | null;
    try {
        // `fields` drops references to deleted components, which reads as lossy below.
        // Cast: typed as FullField[] but plain fields are normalised at runtime.
        query = parseJsonLogic(fromFormioJsonLogic(value, meta), {
            fields: fields as any,
            listsAsArrays: true,
        }) ?? null;
    } catch {
        query = null;
    }

    if (!query || query.rules.length === 0) {
        return { query: EMPTY_QUERY, lossy: true };
    }

    return { query, lossy: !_.isEqual(normalize(serializeQuery(query, meta)), normalize(value)) };
}

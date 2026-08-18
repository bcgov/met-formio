import _ from 'lodash';
import { formatQuery } from 'react-querybuilder';
import { parseJsonLogic } from 'react-querybuilder/parseJsonLogic';
/**
 * Formio evaluates conditional.json as jsonLogic.apply(json, { data, row, form, _ }),
 * so field references must be rooted at `data.`. react-querybuilder emits bare names.
 */
export const DATA_PREFIX = 'data.';
export const EMPTY_QUERY = { combinator: 'and', rules: [] };
export function buildFieldMeta(fields) {
    const meta = new Map();
    fields.forEach((field) => {
        const name = field.name;
        const componentKey = field._rankingComponentKey;
        const statementId = field._statementId;
        if (componentKey && statementId) {
            meta.set(name, { kind: 'ranking', componentKey, statementId });
        }
        else if (field._booleanValue) {
            meta.set(name, { kind: 'boolean' });
        }
    });
    return meta;
}
const varNode = (path) => ({ var: path });
const isVar = (node) => !!node &&
    typeof node === 'object' &&
    !Array.isArray(node) &&
    typeof node.var === 'string' &&
    Object.keys(node).length === 1;
const addPrefix = (path) => (path.startsWith(DATA_PREFIX) ? path : `${DATA_PREFIX}${path}`);
// Tolerant of values written before the prefix was applied.
const stripPrefix = (path) => (path.startsWith(DATA_PREFIX) ? path.slice(DATA_PREFIX.length) : path);
const singleOp = (node) => {
    if (!node || typeof node !== 'object' || Array.isArray(node))
        return null;
    const keys = Object.keys(node);
    return keys.length === 1 ? [keys[0], node[keys[0]]] : null;
};
const isPair = (args) => Array.isArray(args) && args.length === 2 && isVar(args[0]);
/** An untouched formio field holds '', a missing path resolves to null — accept both. */
const emptyCheck = (field) => ({ in: [varNode(addPrefix(field)), [null, '']] });
const isEmptyCheckList = (values) => Array.isArray(values) && values.length === 2 && values[0] === null && values[1] === '';
/** Ranks are strings today, but jsonLogic's `in` is strict, so match numbers too. */
const expandRankValues = (values) => {
    if (!Array.isArray(values))
        return values;
    const numeric = values
        .filter((v) => typeof v === 'string' && v.trim() !== '')
        .map(Number)
        .filter((n) => Number.isFinite(n) && !values.includes(n));
    return [...values, ...numeric];
};
const collapseRankValues = (values) => {
    if (!Array.isArray(values))
        return values;
    const strings = values.filter((v) => typeof v === 'string');
    return strings.length > 0 ? strings : values.map(String);
};
/**
 * SimpleRanking stores rows of { statementId, rank }, so a per-statement condition is a
 * `some` over the component. jsonLogic rescopes `var` inside it, so no prefix there.
 */
const rankingSome = (info, values) => ({
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
const parseRankingSome = (componentKey, condition) => {
    if (!condition || typeof condition !== 'object' || !Array.isArray(condition.and))
        return null;
    const statement = condition.and.find((clause) => Array.isArray(clause?.['===']) && clause['==='][0]?.var === 'statementId');
    const rank = condition.and.find((clause) => Array.isArray(clause?.in) && clause.in[0]?.var === 'rank');
    if (!statement || !rank)
        return null;
    return { in: [varNode(`${componentKey}.${statement['==='][1]}`), collapseRankValues(rank.in[1])] };
};
/** react-querybuilder JSONLogic -> the JSONLogic formio actually evaluates. */
export function toFormioJsonLogic(node, meta) {
    if (!node || typeof node !== 'object')
        return node;
    if (Array.isArray(node))
        return node.map((item) => toFormioJsonLogic(item, meta));
    const op = singleOp(node);
    if (op) {
        const [operator, args] = op;
        if (operator === 'in' && isPair(args)) {
            const info = meta.get(args[0].var);
            if (info?.kind === 'ranking')
                return rankingSome(info, args[1]);
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
    if (isVar(node))
        return varNode(addPrefix(node.var));
    return _.mapValues(node, (value) => toFormioJsonLogic(value, meta));
}
/** The inverse of toFormioJsonLogic, so parseJsonLogic sees shapes it understands. */
export function fromFormioJsonLogic(node, meta) {
    if (!node || typeof node !== 'object')
        return node;
    if (Array.isArray(node))
        return node.map((item) => fromFormioJsonLogic(item, meta));
    const op = singleOp(node);
    if (op) {
        const [operator, args] = op;
        if (operator === 'some' && isPair(args)) {
            const ranking = parseRankingSome(stripPrefix(args[0].var), args[1]);
            if (ranking)
                return ranking;
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
    if (isVar(node))
        return varNode(stripPrefix(node.var));
    return _.mapValues(node, (value) => fromFormioJsonLogic(value, meta));
}
const VALUELESS_OPERATORS = new Set(['null', 'notNull']);
/** react-querybuilder creates a rule on "+ Rule", before the author picks a value. */
export function isRuleComplete(rule) {
    if (!rule || !rule.field || !rule.operator)
        return false;
    if (VALUELESS_OPERATORS.has(rule.operator))
        return true;
    const { value } = rule;
    if (Array.isArray(value))
        return value.length > 0;
    return value !== undefined && value !== null && value !== '';
}
/** Drops unfinished rules, and any group left empty as a result. */
export function pruneIncompleteRules(group) {
    const rules = group.rules
        .map((rule) => (rule && Array.isArray(rule.rules) ? pruneIncompleteRules(rule) : rule))
        .filter((rule) => rule && Array.isArray(rule.rules) ? rule.rules.length > 0 : isRuleComplete(rule));
    return { ...group, rules };
}
/** null when the query is empty, so formio treats the component as unconditional. */
export function serializeQuery(query, meta) {
    if (!query || query.rules.length === 0)
        return null;
    // Values are already arrays because QueryBuilder is configured with listsAsArrays.
    const raw = formatQuery(query, 'jsonlogic');
    if (!raw || typeof raw !== 'object')
        return null;
    return toFormioJsonLogic(raw, meta);
}
/** What gets persisted. Unfinished rules stay on screen, they just are not saved. */
export function serializeCompleteRules(query, meta) {
    if (!query)
        return null;
    return serializeQuery(pruneIncompleteRules(query), meta);
}
/** Collapse single-clause and/or wrappers so round-trip comparisons ignore them. */
function normalize(node) {
    if (!node || typeof node !== 'object')
        return node;
    if (Array.isArray(node))
        return node.map(normalize);
    const op = singleOp(node);
    if (op && (op[0] === 'and' || op[0] === 'or') && Array.isArray(op[1]) && op[1].length === 1) {
        return normalize(op[1][0]);
    }
    return _.mapValues(node, normalize);
}
export function parseInitialQuery(value, fields, meta) {
    if (!value || typeof value !== 'object' || Object.keys(value).length === 0) {
        return { query: EMPTY_QUERY, lossy: false };
    }
    let query = null;
    try {
        // `fields` drops references to deleted components, which reads as lossy below.
        // Cast: typed as FullField[] but plain fields are normalised at runtime.
        query = parseJsonLogic(fromFormioJsonLogic(value, meta), {
            fields: fields,
            listsAsArrays: true,
        }) ?? null;
    }
    catch {
        query = null;
    }
    if (!query || query.rules.length === 0) {
        return { query: EMPTY_QUERY, lossy: true };
    }
    return { query, lossy: !_.isEqual(normalize(serializeQuery(query, meta)), normalize(value)) };
}

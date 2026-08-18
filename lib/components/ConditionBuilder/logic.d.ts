import { RuleGroupType, Field } from 'react-querybuilder';
/**
 * Formio evaluates conditional.json as jsonLogic.apply(json, { data, row, form, _ }),
 * so field references must be rooted at `data.`. react-querybuilder emits bare names.
 */
export declare const DATA_PREFIX = "data.";
export declare const EMPTY_QUERY: RuleGroupType;
/** The two field kinds that need more than a straight name-to-path translation. */
export type FieldMeta = {
    kind: 'ranking';
    componentKey: string;
    statementId: string;
} | {
    kind: 'boolean';
};
export declare function buildFieldMeta(fields: Field[]): Map<string, FieldMeta>;
/** react-querybuilder JSONLogic -> the JSONLogic formio actually evaluates. */
export declare function toFormioJsonLogic(node: any, meta: Map<string, FieldMeta>): any;
/** The inverse of toFormioJsonLogic, so parseJsonLogic sees shapes it understands. */
export declare function fromFormioJsonLogic(node: any, meta: Map<string, FieldMeta>): any;
/** react-querybuilder creates a rule on "+ Rule", before the author picks a value. */
export declare function isRuleComplete(rule: any): boolean;
/** Drops unfinished rules, and any group left empty as a result. */
export declare function pruneIncompleteRules(group: RuleGroupType): RuleGroupType;
/** null when the query is empty, so formio treats the component as unconditional. */
export declare function serializeQuery(query: RuleGroupType | null, meta: Map<string, FieldMeta>): any;
/** What gets persisted. Unfinished rules stay on screen, they just are not saved. */
export declare function serializeCompleteRules(query: RuleGroupType | null, meta: Map<string, FieldMeta>): any;
export interface ParsedQuery {
    query: RuleGroupType;
    /** Stored logic the builder cannot reproduce. Callers must warn, not overwrite. */
    lossy: boolean;
}
export declare function parseInitialQuery(value: any, fields: Field[], meta: Map<string, FieldMeta>): ParsedQuery;

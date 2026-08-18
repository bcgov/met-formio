import { Field } from 'react-querybuilder';
/** Which higher-precedence setting is currently overriding conditional.json, if any. */
export type Conflict = 'simple' | 'custom' | null;
interface Props {
    fields: Field[];
    initialValue: any;
    onChange: (jsonLogic: any) => void;
    conflict?: Conflict;
}
export default function ConditionBuilderWidget({ fields, initialValue, onChange, conflict }: Props): import("react").JSX.Element;
export {};

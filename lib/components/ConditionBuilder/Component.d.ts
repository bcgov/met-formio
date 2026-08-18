import { Root } from 'react-dom/client';
import type { Field } from 'react-querybuilder';
import { Conflict } from './ConditionBuilderWidget';
export default function createConditionBuilder(): {
    new (): {
        [x: string]: any;
        _reactRoot: Root | null;
        _container: HTMLElement | null;
        _valueKey: string;
        _conflict: Conflict;
        _watchingConflicts: boolean;
        render(): string;
        attach(element: HTMLElement): any;
        detach(): any;
        destroy(): any;
        setValue(value: any): any;
        _renderReact(): void;
        _unmountReact(): void;
        /**
         * checkCondition() resolves customConditional, then the simple conditional, and
         * only then conditional.json — so either of those silences the visual builder.
         */
        _getConflict(): Conflict;
        _watchConflicts(): void;
        _getFields(): Field[];
    };
    [x: string]: any;
    schema(): any;
    get builderInfo(): boolean;
};

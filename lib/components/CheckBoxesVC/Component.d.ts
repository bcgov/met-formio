import editForm from './Component.form';
export declare const CHECKBOXES_VC = "checkboxesvc";
declare const Component_base: any;
export default class Component extends Component_base {
    static schema(...extend: any[]): any;
    static editForm: typeof editForm;
    static get builderInfo(): {
        title: string;
        group: string;
        icon: string;
        weight: number;
        documentation: string;
        schema: any;
    };
    init(): void;
    fetchVcs(): Promise<void>;
    loadVcs(vcs: any): void;
    handleLoadingError(err: any): void;
    get grandparentRender(): any;
    render(): any;
    updateValue(value: any, flags: any): any;
}
export {};

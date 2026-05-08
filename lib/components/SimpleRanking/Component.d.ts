import editForm from './Component.form';
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
    get noDragDrop(): boolean;
    /**
     * Shuffle array using Fisher-Yates algorithm
     */
    private shuffleArray;
    init(): void;
    get grandparentRender(): any;
    render(children: any): any;
    attach(element: any): any;
    checkAllRows(): void;
}
export {};

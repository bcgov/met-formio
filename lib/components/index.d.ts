import simpletextfield from './SimpleTextField/Component';
import simpletextarea from './SimpleTextArea/Component';
import simpleradios from './SimpleRadios/Component';
import simplecheckboxes from './SimpleCheckboxes/Component';
import simplepostalcode from "./SimplePostalCode/Component";
import header from "./Header/Component";
import paragraph from "./Paragraph/Component";
import checkboxesvc from "./CheckBoxesVC/Component";
declare const _default: {
    simpletextfield: typeof simpletextfield;
    simpletextarea: typeof simpletextarea;
    simpleradios: typeof simpleradios;
    simplecheckboxes: typeof simplecheckboxes;
    header: typeof header;
    paragraph: typeof paragraph;
    simplepostalcode: typeof simplepostalcode;
    checkboxesvc: typeof checkboxesvc;
    textareavc: {
        form: string;
        html: string;
    };
};
export default _default;

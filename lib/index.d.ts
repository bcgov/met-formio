declare const _default: {
    components: {
        simpletextfield: typeof import("./components/SimpleTextField/Component").default;
        simpletextarea: typeof import("./components/SimpleTextArea/Component").default;
        simpleradios: typeof import("./components/SimpleRadios/Component").default;
        simplecheckboxes: typeof import("./components/SimpleCheckboxes/Component").default;
        header: typeof import("./components/Header/Component").default;
        paragraph: typeof import("./components/Paragraph/Component").default;
        simplepostalcode: typeof import("./components/SimplePostalCode/Component").default;
        categorycheckboxes: typeof import("./components/CategoryCheckboxes/Component").default;
        categorytextarea: typeof import("./components/CategoryTextArea/Component").default;
        categorycommentcontainer: typeof import("./components/CategoryComponentContainer/Component").default;
    };
    templates: {
        bootstrap: {
            checkmatrix: {
                form: string;
            };
            categorycomponent: {
                form: string;
                html: string;
            };
            categorytextarea: {
                form: string;
                html: string;
            };
        };
    };
};
export default _default;

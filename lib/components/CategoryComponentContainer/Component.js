var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/* tslint:disable */
import { Components } from 'formiojs';
var ParentComponent = Components.components.container;
import editForm from './Component.form';
import { Constants } from '../Common/Constants';
import { CHECKBOXES_VC } from '../CheckBoxesVC/Component';
var ID = 'categorycommentcontainer';
var DISPLAY = 'Category Comment';
var OTHER = 'other';
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    function Component() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Component.schema = function () {
        var extend = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            extend[_i] = arguments[_i];
        }
        return ParentComponent.schema.apply(ParentComponent, __spreadArray([{
                label: DISPLAY,
                tableView: false,
                key: ID,
                input: true,
                components: [
                    {
                        label: "We would like to learn more about your concerns, thoughts, and idea in relation to the items you selected.",
                        key: "textareavc",
                        type: "textareavc",
                        rows: 3,
                        wysiwyg: false,
                        editor: "",
                        spellcheck: true,
                        fixedSize: true,
                        inputFormat: "plain",
                        validate: {
                            minWords: "",
                            maxWords: "",
                        },
                        logic: [
                            {
                                name: "componentChange event",
                                trigger: {
                                    type: "event",
                                    event: "componentChange",
                                },
                                actions: [
                                    {
                                        name: "update value components",
                                        type: "customAction",
                                        customAction: "const change = result[0]\nif(change && change.component.key === '".concat(CHECKBOXES_VC, "')") +
                                            " {\n  const vcs = change.component.values.filter(vc => change.value[vc.value] && vc.value !== '".concat(OTHER, "')\n") +
                                            "  instance.valueComponents = [...vcs]\n  instance.redraw()\n}",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        label: "Tell us more about the other concerns that you have.",
                        key: "textareavc1",
                        customConditional: "show = data && data['".concat(CHECKBOXES_VC, "'] && data['").concat(CHECKBOXES_VC, "']['").concat(OTHER, "']"),
                        type: "textareavc",
                        rows: 3,
                        wysiwyg: false,
                        editor: "",
                        spellcheck: true,
                        fixedSize: true,
                        inputFormat: "plain",
                        validate: {
                            minWords: "",
                            maxWords: "",
                        },
                        logic: [
                            {
                                name: "componentChange event",
                                trigger: {
                                    type: "event",
                                    event: "componentChange",
                                },
                                actions: [
                                    {
                                        name: "update value components",
                                        type: "customAction",
                                        customAction: "const change = result[0]\nif(change && change.component.key === '".concat(CHECKBOXES_VC, "')") +
                                            " {\n  const vcs = change.component.values.filter(vc => vc.value === '".concat(OTHER, "')\n") +
                                            "  instance.valueComponents = [...vcs]\n  instance.redraw()\n}",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            }], extend, false));
    };
    Object.defineProperty(Component, "builderInfo", {
        get: function () {
            return {
                title: DISPLAY,
                group: "simple",
                icon: "pencil-square-o",
                weight: 40,
                documentation: Constants.DEFAULT_HELP_LINK,
                schema: Component.schema(),
            };
        },
        enumerable: false,
        configurable: true
    });
    Component.editForm = editForm;
    return Component;
}(ParentComponent));
export default Component;

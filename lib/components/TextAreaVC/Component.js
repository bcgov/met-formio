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
var ParentComponent = Components.components.textarea;
import editForm from './Component.form';
import { Constants } from '../Common/Constants';
import { CHECKBOXES_VC } from '../CheckBoxesVC/Component';
var ID = 'textareavc';
var DISPLAY = 'Value Component Comment';
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
                type: ID,
                label: DISPLAY,
                key: ID,
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
                                    " {\n  const vcs = change.component.values.filter(vc => change.value[vc.value])\n" +
                                    "  instance.valueComponents = [...vcs]\n  instance.redraw()\n}",
                            },
                        ],
                    },
                ],
                defaultValueComponents: [],
            }], extend, false));
    };
    Object.defineProperty(Component, "builderInfo", {
        get: function () {
            return {
                title: DISPLAY,
                group: 'simple',
                icon: 'comment-o',
                weight: 2,
                documentation: Constants.DEFAULT_HELP_LINK,
                schema: Component.schema(),
            };
        },
        enumerable: false,
        configurable: true
    });
    Component.prototype.init = function () {
        _super.prototype.init.call(this);
        this.valueComponents = this.component.defaultValueComponents ? __spreadArray([], this.component.defaultValueComponents, true) : [];
    };
    Component.prototype.renderElement = function (value, index) {
        var info = this.inputInfo;
        info.attr = info.attr || {};
        info.content = value;
        if ((this.options.readOnly || this.disabled) && !this.isHtmlRenderMode()) {
            var elementStyle = this.info.attr.style || '';
            var children = "<div ref=\"input\" class=\"formio-editor-read-only-content\" ".concat(elementStyle ? "style='".concat(elementStyle, "'") : '', "></div>");
            return this.renderTemplate('well', {
                children: children,
                nestedKey: this.key,
                value: value,
            });
        }
        return this.renderTemplate('textareavc', {
            input: info,
            value: value,
            index: index,
            valueComponents: this.valueComponents,
        });
    };
    Component.editForm = editForm;
    return Component;
}(ParentComponent));
export default Component;

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
var ParentComponent = Components.components.selectboxes;
import editForm from './Component.form';
import { Constants } from '../Common/Constants';
var ID = 'checkboxesvc';
var DISPLAY = 'VC Checkbox';
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
                inline: false,
                values: [{ label: 'Virtual Components', value: 'vcs' }],
                fieldSet: false,
                customDefaultValue: '  const populateSelectBoxes = (vcs) => {\n    component.values = vcs.map((vc) =>' +
                    ' {\n      return {\n        label: vc.title,\n        value: vc.id,\n        icon: vc.icon,\n      };\n' +
                    '    });\n  };\n\n  const apiurl = localStorage.getItem("apiurl");\n  Formio.request(`${apiurl}/valuecomponents/`' +
                    ', "GET", null, null, {\n    headers: {\n      "content-type": "application/json",\n    },\n    mode: "cors",\n' +
                    '  }).then(function (result) {\n    console.log(result)\n    populateSelectBoxes(JSON.parse(result));\n  });',
            }], extend, false));
    };
    Object.defineProperty(Component, "builderInfo", {
        get: function () {
            return {
                title: DISPLAY,
                group: 'simple',
                icon: 'check-square-o',
                weight: 5,
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

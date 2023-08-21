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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
import { Components, Formio } from "formiojs";
var ParentComponent = Components.components.selectboxes;
var FieldComponent = Components.components.field;
import editForm from "./Component.form";
import { Constants } from "../Common/Constants";
export var CATEGORY_CHECKBOXES = "categorycheckboxes";
var DISPLAY = "Category Checkbox";
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
                type: CATEGORY_CHECKBOXES,
                label: DISPLAY,
                key: CATEGORY_CHECKBOXES,
                inline: false,
                values: [{ label: "Category Components", value: "CCs" }],
                fieldSet: false,
            }], extend, false));
    };
    Object.defineProperty(Component, "builderInfo", {
        get: function () {
            return {
                title: DISPLAY,
                group: "simple",
                icon: "check-square-o",
                weight: 80,
                documentation: Constants.DEFAULT_HELP_LINK,
                schema: Component.schema(),
            };
        },
        enumerable: false,
        configurable: true
    });
    Component.prototype.init = function () {
        _super.prototype.init.call(this);
        this.fetchVcs();
    };
    Component.prototype.fetchVcs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, resp, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.component.values.length > 1) {
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        this.loading = true;
                        url = "".concat(sessionStorage.getItem("apiurl"));
                        return [4 /*yield*/, Formio.request("".concat(url, "/valuecomponents/"), "GET", null, null, {
                                headers: {
                                    "content-type": "application/json",
                                },
                                mode: "cors",
                            })];
                    case 2:
                        resp = _a.sent();
                        this.loadCCs(resp);
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        this.handleLoadingError(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Component.prototype.loadCCs = function (categoryComponents) {
        var loadedCategoryComponents = categoryComponents.map(function (categoryComponent) {
            return {
                label: categoryComponent.title,
                value: categoryComponent.custom_key || categoryComponent.id,
                icon: categoryComponent.icon,
                category: categoryComponent.category,
            };
        });
        this.component.values = __spreadArray([], loadedCategoryComponents, true);
        this.redraw();
    };
    Component.prototype.handleLoadingError = function (err) {
        this.loading = false;
        this.error = true;
        if (err.networkError) {
            this.networkError = true;
        }
        this.emit("componentError", {
            component: this.component,
            message: err.toString(),
        });
        console.warn("Unable to load resources for ".concat(this.key));
    };
    Object.defineProperty(Component.prototype, "grandparentRender", {
        get: function () {
            return FieldComponent.prototype.render;
        },
        enumerable: false,
        configurable: true
    });
    Component.prototype.render = function () {
        // super.render calls render of parent which is Radio which will use radio template
        // we want to skip that and use the render function of radio's parent which is Field
        // so categorycomponent template won't be overridden by radio template
        return this.grandparentRender(this.renderTemplate("categorycomponent", {
            input: this.inputInfo,
            inline: this.component.inline,
            values: this.component.values,
            value: this.dataValue,
            row: this.row,
        }));
    };
    Component.prototype.updateValue = function (value, flags) {
        var changed = _super.prototype.updateValue.call(this, value, flags);
        this.redraw();
        return changed;
    };
    Component.editForm = editForm;
    return Component;
}(ParentComponent));
export default Component;

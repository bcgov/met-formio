/* tslint:disable */
import { Components } from "formiojs";
const ParentComponent = (Components as any).components.textarea;
import editForm from "./Component.form";

import { Constants } from "../Common/Constants";
import { CATEGORY_CHECKBOXES } from "../CategoryCheckboxes/Component";

const ID = "categorytextarea";
const DISPLAY = "Category Component Comment";

export default class Component extends (ParentComponent as any) {
  static schema(...extend) {
    return ParentComponent.schema(
      {
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
                name: "update category components",
                type: "customAction",
                customAction:
                  `const change = result[0]\nif(change && change.component.key === '${CATEGORY_CHECKBOXES}')` +
                  " {\n  const filteredCategoryComponents = change.component.values.filter(cc => change.value[cc.value])\n" +
                  "  instance.categoryComponents = [...filteredCategoryComponents]\n  instance.redraw()\n}",
              },
            ],
          },
        ],
        defaultCategoryComponents: [],
      },
      ...extend
    );
  }

  public static editForm = editForm;

  static get builderInfo() {
    return {
      title: DISPLAY,
      group: "simple",
      icon: "comment-o",
      weight: 2,
      documentation: Constants.DEFAULT_HELP_LINK,
      schema: Component.schema(),
    };
  }

  init() {
    super.init();
    this.categoryComponents = this.component.defaultCategoryComponents
      ? [...this.component.defaultCategoryComponents]
      : [];
  }

  renderElement(value, index) {
    const info = this.inputInfo;
    info.attr = info.attr || {};
    info.content = value;
    if ((this.options.readOnly || this.disabled) && !this.isHtmlRenderMode()) {
      const elementStyle = this.info.attr.style || "";
      const children = `<div ref="input" class="formio-editor-read-only-content" ${
        elementStyle ? `style='${elementStyle}'` : ""
      }></div>`;

      return this.renderTemplate("well", {
        children,
        nestedKey: this.key,
        value,
      });
    }

    return this.renderTemplate("categorytextarea", {
      input: info,
      value,
      index,
      categoryComponents: this.categoryComponents,
    });
  }
}

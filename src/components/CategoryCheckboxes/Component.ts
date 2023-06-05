/* tslint:disable */
import { Components, Formio } from "formiojs";
const ParentComponent = (Components as any).components.selectboxes;
const FieldComponent = (Components as any).components.field;
import editForm from "./Component.form";

import { Constants } from "../Common/Constants";

export const CATEGORY_CHECKBOXES = "categorycheckboxes";
const DISPLAY = "Category Checkbox";

export default class Component extends (ParentComponent as any) {
  static schema(...extend) {
    return ParentComponent.schema(
      {
        type: CATEGORY_CHECKBOXES,
        label: DISPLAY,
        key: CATEGORY_CHECKBOXES,
        inline: false,
        values: [{ label: "Category Components", value: "CCs" }],
        fieldSet: false,
      },
      ...extend
    );
  }

  public static editForm = editForm;

  static get builderInfo() {
    return {
      title: DISPLAY,
      group: "simple",
      icon: "check-square-o",
      weight: 80,
      documentation: Constants.DEFAULT_HELP_LINK,
      schema: Component.schema(),
    };
  }

  init() {
    super.init();
    this.fetchVcs();
  }

  async fetchVcs() {
    if (this.component.values.length > 1) {
      return;
    }
    try {
      this.loading = true;
      const url = `${sessionStorage.getItem("apiurl")}`;
      const resp = await Formio.request(
        `${url}/valuecomponents/`,
        "GET",
        null,
        null,
        {
          headers: {
            "content-type": "application/json",
          },
          mode: "cors",
        }
      );
      this.loadCCs(resp);
    } catch (err) {
      this.handleLoadingError(err);
    }
  }

  loadCCs(categoryComponents) {
    const loadedCategoryComponents = categoryComponents.map(
      (categoryComponent) => {
        return {
          label: categoryComponent.title,
          value: categoryComponent.custom_key || categoryComponent.id,
          icon: categoryComponent.icon,
          category: categoryComponent.category,
        };
      }
    );
    this.component.values = [...loadedCategoryComponents];
    this.redraw();
  }

  handleLoadingError(err) {
    this.loading = false;
    this.error = true;
    if (err.networkError) {
      this.networkError = true;
    }
    this.emit("componentError", {
      component: this.component,
      message: err.toString(),
    });
    console.warn(`Unable to load resources for ${this.key}`);
  }

  get grandparentRender() {
    return FieldComponent.prototype.render;
  }

  render() {
    // super.render calls render of parent which is Radio which will use radio template
    // we want to skip that and use the render function of radio's parent which is Field
    // so categorycomponent template won't be overridden by radio template
    return this.grandparentRender(
      this.renderTemplate("categorycomponent", {
        input: this.inputInfo,
        inline: this.component.inline,
        values: this.component.values,
        value: this.dataValue,
        row: this.row,
      })
    );
  }

  updateValue(value, flags) {
    const changed = super.updateValue(value, flags);
    this.redraw();
    return changed;
  }
}

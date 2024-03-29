/* tslint:disable */
import { Components } from "formiojs";
const ParentComponent = (Components as any).components.htmlelement;
import editForm from "./Component.form";

import { Constants } from "../Common/Constants";

const ID = "simplehtmlelement";
const DISPLAY = "HTML Element";

export default class Component extends (ParentComponent as any) {
  static schema(...extend) {
    return ParentComponent.schema(
      {
        type: ID,
        label: DISPLAY,
        key: ID,
        tag: "p",
      },
      ...extend
    );
  }

  public static editForm = editForm;

  static get builderInfo() {
    return {
      title: DISPLAY,
      group: "layout",
      icon: "code",
      weight: 100,
      documentation: Constants.DEFAULT_HELP_LINK,
      schema: Component.schema(),
    };
  }
}

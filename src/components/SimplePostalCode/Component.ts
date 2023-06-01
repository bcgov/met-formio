/* tslint:disable */
import { Components } from "formiojs";
const ParentComponent = (Components as any).components.textfield;
import editForm from "./Component.form";

import { Constants } from "../Common/Constants";

const ID = "simplepostalcode";
const DISPLAY = "Postal Code";

export default class Component extends (ParentComponent as any) {
  static schema(...extend) {
    return ParentComponent.schema(
      {
        type: ID,
        label: DISPLAY,
        key: ID,
        inputType: "postalcode",
        inputFormat: "plain",
        inputMask: "***",
      },
      ...extend
    );
  }

  public static editForm = editForm;

  static get builderInfo() {
    return {
      title: DISPLAY,
      group: "simple",
      icon: "map",
      weight: 40,
      documentation: Constants.DEFAULT_HELP_LINK,
      schema: Component.schema(),
    };
  }
}

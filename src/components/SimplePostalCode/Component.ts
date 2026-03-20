import { Components } from '@formio/js';
const ParentComponent = (Components as any).components.textfield;
import editForm from './Component.form';

import { Constants } from '../Common/Constants';

const ID = 'simplepostalcode';
const DISPLAY = 'Postal Code';
const DEFAULT_DESCRIPTION = 'Please input the first three characters of your postal code in the format like V9E.';

export default class Component extends (ParentComponent as any) {
  static schema(...extend) {
    return ParentComponent.schema(
      {
        type: ID,
        label: DISPLAY,
        key: ID,
        description: DEFAULT_DESCRIPTION,
        inputType: 'postalcode',
        inputFormat: 'plain',
        inputMask: '***',
      },
      ...extend
    );
  }

  public static editForm = editForm;

  static get builderInfo() {
    return {
      title: DISPLAY,
      group: 'simple',
      icon: 'map',
      weight: 40,
      documentation: Constants.DEFAULT_HELP_LINK,
      schema: Component.schema(),
    };
  }
}

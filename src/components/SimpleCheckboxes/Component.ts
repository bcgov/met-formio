import { Components } from '@formio/js';
const ParentComponent = (Components as any).components.selectboxes;
import editForm from './Component.form';

import { Constants } from '../Common/Constants';

const ID = 'simplecheckboxes';
const DISPLAY = 'Checkbox';
const DEFAULT_DESCRIPTION = 'Check all that apply.';

export default class Component extends (ParentComponent as any) {
  static schema(...extend) {
    return ParentComponent.schema(
      {
        type: ID,
        label: DISPLAY,
        key: ID,
        description: DEFAULT_DESCRIPTION,
        inline: false,
        values: [{ label: '', value: '' }],
        fieldSet: false,
      },
      ...extend
    );
  }

  public static editForm = editForm;

  static get builderInfo() {
    return {
      title: DISPLAY,
      group: 'simple',
      icon: 'check-square-o',
      weight: 70,
      documentation: Constants.DEFAULT_HELP_LINK,
      schema: Component.schema(),
    };
  }
}

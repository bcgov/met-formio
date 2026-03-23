import { Components } from '@formio/js';
const ParentComponent = (Components as any).components.survey;
import editForm from './Component.form';

import { Constants } from '../Common/Constants';

const ID = 'simplesurvey';
const DISPLAY = 'Likert';
const DEFAULT_DESCRIPTION = 'Please select the option that best applies.';

export default class Component extends (ParentComponent as any) {
  static schema(...extend) {
    return ParentComponent.schema(
      {
        type: ID,
        label: DISPLAY,
        key: ID,
        description: DEFAULT_DESCRIPTION,
      },
      ...extend
    );
  }

  public static editForm = editForm;

  static get builderInfo() {
    return {
      title: DISPLAY,
      group: 'simple',
      icon: 'list',
      weight: 36,
      documentation: Constants.DEFAULT_HELP_LINK,
      schema: Component.schema(),
    };
  }
}

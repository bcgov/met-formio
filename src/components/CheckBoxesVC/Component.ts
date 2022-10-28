/* tslint:disable */
import { Components } from 'formiojs';
const ParentComponent = (Components as any).components.selectboxes;
import editForm from './Component.form';

import { Constants } from '../Common/Constants';

const ID = 'checkboxesvc';
const DISPLAY = 'VC Checkbox';

export default class Component extends (ParentComponent as any) {
    static schema(...extend) {
        return ParentComponent.schema(
            {
                type: ID,
                label: DISPLAY,
                key: ID,
                inline: false,
                values: [{ label: 'Virtual Components', value: 'vcs' }],
                fieldSet: false,
                customDefaultValue:
                    '  const populateSelectBoxes = (vcs) => {\n    component.values = vcs.map((vc) =>' +
                    ' {\n      return {\n        label: vc.title,\n        value: vc.id,\n        icon: vc.icon,\n      };\n' +
                    '    });\n  };\n\n  const apiurl = localStorage.getItem("apiurl");\n  Formio.request(`${apiurl}/valuecomponents/`' +
                    ', "GET", null, null, {\n    headers: {\n      "content-type": "application/json",\n    },\n    mode: "cors",\n' +
                    '  }).then(function (result) {\n    console.log(result)\n    populateSelectBoxes(JSON.parse(result));\n  });',
            },
            ...extend,
        );
    }

    public static editForm = editForm;

    static get builderInfo() {
        return {
            title: DISPLAY,
            group: 'simple',
            icon: 'check-square-o',
            weight: 5,
            documentation: Constants.DEFAULT_HELP_LINK,
            schema: Component.schema(),
        };
    }
}

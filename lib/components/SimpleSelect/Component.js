import { Components } from '@formio/js';
const ParentComponent = Components.components.select;
import editForm from './Component.form';
import { Constants } from '../Common/Constants';
const ID = 'simpleselect';
const DISPLAY = 'Drop-down';
const DEFAULT_DESCRIPTION = 'Choose one of the answers above.';
class Component extends ParentComponent {
    static schema(...extend) {
        return ParentComponent.schema({
            type: ID,
            label: DISPLAY,
            key: ID,
            description: DEFAULT_DESCRIPTION,
            dataSrc: 'values',
            dataType: 'auto',
            widget: 'choicesjs',
            idPath: 'id',
            data: {
                values: [],
                json: '',
                url: '',
                resource: '',
                custom: '',
            },
            clearOnRefresh: false,
            limit: 100,
            valueProperty: '',
            lazyLoad: true,
            filter: '',
            searchEnabled: true,
            searchField: '',
            minSearch: 0,
            readOnlyValue: false,
            authenticate: false,
            template: '<span>{{ item.label }}</span>',
            selectFields: '',
            searchThreshold: 0.3,
            uniqueOptions: false,
            tableView: true,
            fuseOptions: {
                include: 'score',
                threshold: 0.3,
            },
            customOptions: {},
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: DISPLAY,
            group: 'simple',
            icon: 'tasks',
            weight: 33,
            documentation: Constants.DEFAULT_HELP_LINK,
            schema: Component.schema(),
        };
    }
}
Component.editForm = editForm;
export default Component;

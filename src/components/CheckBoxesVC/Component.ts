/* tslint:disable */
import { Components, Formio } from 'formiojs';
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

    constructor(component, options, data) {
        super(component, options, data);
        this.previousValue = this.dataValue || null;
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
          const url = `${localStorage.getItem("apiurl")}`;
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
          this.loadVcs(resp.result);
        } catch (err) {
          this.handleLoadingError(err);
        }
    }

    loadVcs(vcs) {
        const valueComponents = vcs.map((vc) => {
            return {
                label: vc.title,
                value: vc.id,
                icon: vc.icon,
            };
        });
        this.component.values = [...valueComponents];
        this.redraw();
    }

    handleLoadingError(err) {
        this.loading = false;
        this.error = true;
        if (err.networkError) {
            this.networkError = true;
        }
        this.emit('componentError', {
            component: this.component,
            message: err.toString(),
        });
        console.warn(`Unable to load resources for ${this.key}`);
    }
}

/* tslint:disable */
import { Components, Formio } from 'formiojs';
const ParentComponent = (Components as any).components.selectboxes;
const FieldComponent = (Components as any).components.field;
import editForm from './Component.form';

import { Constants } from '../Common/Constants';

export const CHECKBOXES_VC = 'checkboxesvc';
const DISPLAY = 'VC Checkbox';

export default class Component extends (ParentComponent as any) {
    static schema(...extend) {
        return ParentComponent.schema(
            {
                type: CHECKBOXES_VC,
                label: DISPLAY,
                key: CHECKBOXES_VC,
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
            const url = `${sessionStorage.getItem('apiurl')}`;
            const resp = await Formio.request(`${url}/valuecomponents/`, 'GET', null, null, {
                headers: {
                    'content-type': 'application/json',
                },
                mode: 'cors',
            });
            this.loadVcs(resp.result);
        } catch (err) {
            this.handleLoadingError(err);
        }
    }

    loadVcs(vcs) {
        const valueComponents = vcs.map((vc) => {
            return {
                label: vc.title,
                value: vc.custom_key || vc.id,
                icon: vc.icon,
                category: vc.category,
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

    get grandparentRender() {
        return FieldComponent.prototype.render;
    }

    render() {
        // super.render calls render of parent which is Radio which will use radio template
        // we want to skip that and use the render function of radio's parent which is Field
        // so valuecomponent template won't be overridden by radio template
        return this.grandparentRender(
            this.renderTemplate('valuecomponent', {
                input: this.inputInfo,
                inline: this.component.inline,
                values: this.component.values,
                value: this.dataValue,
                row: this.row,
            }),
        );
    }

    updateValue(value, flags) {
        const changed = super.updateValue(value, flags);
        this.redraw();
        return changed;
    }
}

import { Components } from '@formio/js';
export default function (...extend) {
    const BaseComponent = Components.components.component;
    return BaseComponent.editForm([], ...extend);
}

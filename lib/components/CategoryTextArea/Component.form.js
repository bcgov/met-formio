import { Components } from '@formio/js';
const BaseComponent = Components.components.component;
export default function (...extend) {
    return BaseComponent.editFrom([], ...extend);
}

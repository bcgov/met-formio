import { Components } from '@formio/js';

const BaseComponent = (Components as any).components.component;

export default function (...extend) {
  return BaseComponent.editForm([], ...extend);
}

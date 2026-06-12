import { Components } from '@formio/js';

export default function (...extend) {
  const BaseComponent = (Components as any).components.component;
  return BaseComponent.editForm([], ...extend);
}

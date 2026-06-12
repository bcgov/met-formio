import getComponents from './components';
import templates from './templates';

let _components: Record<string, any> | null = null;

export default {
    get components() {
        if (!_components) _components = getComponents();
        return _components;
    },
    templates,
};

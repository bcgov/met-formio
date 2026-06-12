import getComponents from './components';
import templates from './templates';
let _components = null;
export default {
    get components() {
        if (!_components)
            _components = getComponents();
        return _components;
    },
    templates,
};

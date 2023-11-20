/* tslint:disable */
import { Components } from 'formiojs';
const ParentComponent = (Components as any).components.content;
import editForm from './Component.form';

import { Constants } from '../Common/Constants';

const ID = 'simplecontent';
const DISPLAY = 'Content';

export default class Component extends (ParentComponent as any) {
    static schema(...extend) {
        return ParentComponent.schema(
            {
                type: ID,
                label: DISPLAY,
                key: ID,
                input: false,
                html: '',
            },
            ...extend,
        );
    }

    public static editForm = editForm;

    render() {
        const div = super.render(
            this.renderTemplate('html', {
                tag: 'div',
                attrs: [],
                content: this.content,
            }),
        );

        // Create a DOM parser to parse the HTML string into a document
        const parser = new DOMParser();
        const doc = parser.parseFromString(div, 'text/html');

        // Get all the <a> elements in the document
        const links = doc.getElementsByTagName('a');
        for (let i = 0; i < links.length; i++) {
            const link = links[i];

            // Set the target attribute to '_blank' to open in a new tab
            link.setAttribute('target', '_blank');

            // Add rel="noopener noreferrer" for security
            link.setAttribute('rel', 'noopener noreferrer');
        }

        // Serialize the document back into an HTML string
        const serializer = new XMLSerializer();
        const updatedContent = serializer.serializeToString(doc);

        return updatedContent;
    }

    static get builderInfo() {
        return {
            title: DISPLAY,
            group: 'simple',
            icon: 'html5',
            weight: 3,
            documentation: Constants.DEFAULT_HELP_LINK,
            schema: Component.schema(),
        };
    }
}

import { getContextComponents } from '@formio/js/utils';
import EditFormUtils from './utils';
/* eslint-disable quotes, max-len */
export default [
    {
        type: 'panel',
        title: 'Simple',
        key: 'simple-conditional',
        theme: 'default',
        components: [
            {
                type: 'select',
                input: true,
                label: 'This component should Display:',
                key: 'conditional.show',
                dataSrc: 'values',
                data: {
                    values: [
                        { label: 'True', value: 'true' },
                        { label: 'False', value: 'false' },
                    ],
                },
            },
            {
                type: 'select',
                input: true,
                label: 'When the form component:',
                key: 'conditional.when',
                dataSrc: 'custom',
                valueProperty: 'value',
                data: {
                    custom(context) {
                        return getContextComponents(context, false).map(({ label, value }) => {
                            const keySuffix = ` (${value})`;
                            const text = label.endsWith(keySuffix)
                                ? label.slice(0, -keySuffix.length)
                                : label;
                            const truncated = text.length > 50 ? text.slice(0, 47) + '...' : text;
                            return { label: `${truncated} (${value})`, value };
                        });
                    },
                },
            },
            {
                type: 'textfield',
                input: true,
                label: 'Has the value:',
                key: 'conditional.eq',
            },
        ],
    },
    EditFormUtils.javaScriptValue(
        'Advanced Conditions',
        'customConditional',
        'conditional.json',
        110,
        '<p>You must assign the <strong>show</strong> variable a boolean result.</p>' +
            '<p><strong>Note: Advanced Conditional logic will override the results of the Simple Conditional logic.</strong></p>' +
            '<h5>Example</h5><pre>show = !!data.showMe;</pre>',
        '<p><a href="http://formio.github.io/formio.js/app/examples/conditions.html" target="_blank" rel="noopener noreferrer">Click here for an example</a></p>',
        '',
        false,
    ),
];
/* eslint-enable quotes, max-len */

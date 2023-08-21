export default {
    key: 'display',
    components: [
        {
            key: 'tableView',
            ignore: true,
        },
        {
            key: 'hidden',
            ignore: true,
        },
        {
            key: 'modalEdit',
            ignore: true,
        },
        {
            key: 'refreshOnChange',
            ignore: true,
        },
        {
            key: 'className',
            ignore: true,
        },
        {
            key: 'prefix',
            ignore: true,
        },
        {
            key: 'suffix',
            ignore: true,
        },
        {
            key: 'inputMask',
            ignore: true,
        },
        {
            key: 'allowMultipleMasks',
            ignore: true,
        },
        {
            key: 'showWordCount',
            ignore: true,
        },
        {
            key: 'showCharCount',
            ignore: true,
        },
        {
            key: 'labelPosition',
            ignore: true,
        },
        {
            key: 'label',
            ignore: true,
        },
        {
            key: 'description',
            ignore: true,
        },
        {
            key: 'tooltip',
            ignore: true,
        },
        {
            key: 'tabindex',
            ignore: true,
        },
        {
            key: 'autofocus',
            ignore: true,
        },
        {
            key: 'disabled',
            ignore: true,
        },
        {
            key: 'hideLabel',
            ignore: true,
        },
        {
            key: 'placeholder',
            ignore: true,
        },
        {
            key: 'customClass',
            ignore: true,
        },
        {
            type: 'textarea',
            input: true,
            editor: 'ace',
            rows: 1,
            as: 'html',
            label: 'Header',
            tooltip:
                'Write your header in this section.<br> You can preview the header on the right in the “Preview” section.',
            defaultValue: '<div class="well">Header Content</div>',
            key: 'content',
            weight: 0,
        },
    ],
};

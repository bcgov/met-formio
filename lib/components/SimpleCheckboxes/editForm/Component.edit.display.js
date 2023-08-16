export default [
    {
        weight: 0,
        type: 'textfield',
        input: true,
        key: 'label',
        label: 'Question/Label',
        placeholder: 'Radio Button',
        tooltip: 'Write your question or label in this section. <br>You can preview the question/label on the right in the “Preview” section. ',
        validate: {
            required: true,
        },
    },
    {
        weight: 100,
        type: 'textarea',
        input: true,
        key: 'description',
        label: 'Description',
        placeholder: 'Description for this field.',
        tooltip: 'The description is text that will appear below the input field. You can use this text to add details. For example: “Please select only one option.” <br> You can preview the tooltip on the right in the “Preview” section. ',
        editor: 'ace',
        as: 'html',
        wysiwyg: {
            minLines: 3,
            isUseWorkerDisabled: true,
        },
    },
    {
        weight: 200,
        type: 'textarea',
        input: true,
        key: 'tooltip',
        label: 'Tooltip',
        placeholder: 'To add a tooltip to this field, enter text here.',
        tooltip: 'Add a tooltip to your question/label.',
        editor: 'ace',
        as: 'html',
        wysiwyg: {
            minLines: 3,
            isUseWorkerDisabled: true,
        },
    },
];

/* eslint-disable quotes, max-len */
export default [
    {
        weight: 0,
        type: 'select',
        key: 'validateOn',
        defaultValue: 'change',
        input: true,
        label: 'Validate On',
        tooltip:
            'Determine when this component should trigger validation. Validate on change will validate when the users click to move to the previous/next page or submit the form. Validate on blur will validate as soon as an answer is entered in the field. For the best experience, we recommend validating on change.',
        dataSrc: 'values',
        data: {
            values: [
                {
                    label: 'Change',
                    value: 'change',
                },
                {
                    label: 'Blur',
                    value: 'blur',
                },
            ],
        },
    },
    {
        weight: 10,
        type: 'checkbox',
        label: 'Required',
        tooltip:
            'This will make this question mandatory. A required field must be filled in before the form can be submitted.',
        key: 'validate.required',
        input: true,
        defaultValue: true,
    },
    {
        weight: 200,
        key: 'validate.customMessage',
        label: 'Custom Error Message',
        placeholder: 'Custom Error Message',
        type: 'textfield',
        tooltip:
            'Customize the error message displayed when the content entered does not match the requirements for this filed such as Input Mask, Minimum and Maximum Characters or Words Count. <br> For example: The minimum number of characters for a field has been set to 10. User enters 7 characters. The Custom Error Message could be “Please enter a minimum of 10 characters.” ',
        input: true,
    },
];
/* eslint-enable quotes, max-len */

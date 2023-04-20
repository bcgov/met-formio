/* eslint-disable quotes, max-len */
export default [
  {
    weight: 0,
    type: "select",
    key: "validateOn",
    defaultValue: "blur",
    input: true,
    label: "Validate On",
    tooltip: "Determines when this component should trigger validation.",
    dataSrc: "values",
    data: {
      values: [
        { label: "Change", value: "change" },
        { label: "Blur", value: "blur" },
      ],
    },
  },
  {
    weight: 10,
    type: "checkbox",
    label: "Required",
    tooltip:
      "A required field must be filled in before the form can be submitted.",
    key: "validate.required",
    input: true,
    defaultValue: true,
  },
  {
    weight: 200,
    key: "validate.customMessage",
    label: "Custom Error Message",
    placeholder: "Custom Error Message",
    type: "textfield",
    tooltip: "Error message displayed if any error occurred.",
    input: true,
  },
];
/* eslint-enable quotes, max-len */

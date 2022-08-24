import common from '../../Common/Simple.edit.display';
export default {
    key: 'display',
    components: [
        ...common,
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
            key: 'placeholder',
            ignore: true,
        },
        {
            weight: 410,
            type: 'textfield',
            input: true,
            key: 'inputMask',
            label: 'Input Mask',
            tooltip:
                "An input mask helps the user with input by ensuring a predefined format.<br><br>9: numeric<br>a: alphabetical - small<br>A: alphabetical - capital or small<br>*: alphanumeric<br><br>Example telephone mask: (999) 999-9999<br>Example full postal code mask: A9A-9A9<br><br>See the <a target='_blank' href='https://github.com/RobinHerbots/jquery.inputmask'>jquery.inputmask documentation</a> for more information.</a>",
        },
    ],
};

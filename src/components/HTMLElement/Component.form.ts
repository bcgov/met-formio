import baseEditForm from 'formiojs/components/_classes/component/Component.form'; 

export default function (...extend) {
    const editForm = baseEditForm([], ...extend);
    return editForm;
}

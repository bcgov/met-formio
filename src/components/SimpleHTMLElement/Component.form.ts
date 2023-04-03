import baseEditForm from 'formiojs/components/html/HTML.form'; 

export default function (...extend) {
    const editForm = baseEditForm([], ...extend);
    return editForm;
}

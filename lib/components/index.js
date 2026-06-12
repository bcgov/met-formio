import createSimpleTextField from './SimpleTextField/Component';
import createSimpleTextArea from './SimpleTextArea/Component';
import createSimpleRadios from './SimpleRadios/Component';
import createSimpleCheckboxes from './SimpleCheckboxes/Component';
import createSimplePostalCode from './SimplePostalCode/Component';
import createHeader from './Header/Component';
import createParagraph from './Paragraph/Component';
import createSimpleContent from './SimpleContent/Component';
import createCategoryCheckboxes from './CategoryCheckboxes/Component';
import createCategoryTextArea from './CategoryTextArea/Component';
import createCategoryComponentContainer from './CategoryComponentContainer/Component';
import createSimpleHTMLElement from './SimpleHTMLElement/Component';
import createSimpleSelect from './SimpleSelect/Component';
import createSimpleSurvey from './SimpleSurvey/Component';
import createSimpleRanking from './SimpleRanking/Component';
let _cache = null;
export default function getComponents() {
    if (!_cache) {
        _cache = {
            simpletextfield: createSimpleTextField(),
            simpletextarea: createSimpleTextArea(),
            simpleradios: createSimpleRadios(),
            simplecheckboxes: createSimpleCheckboxes(),
            simplepostalcode: createSimplePostalCode(),
            header: createHeader(),
            paragraph: createParagraph(),
            simplecontent: createSimpleContent(),
            categorycheckboxes: createCategoryCheckboxes(),
            categorytextarea: createCategoryTextArea(),
            categorycommentcontainer: createCategoryComponentContainer(),
            simplehtmlelement: createSimpleHTMLElement(),
            simpleselect: createSimpleSelect(),
            simplesurvey: createSimpleSurvey(),
            simpleranking: createSimpleRanking(),
        };
    }
    return _cache;
}

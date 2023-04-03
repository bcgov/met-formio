Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default=function(ctx) {
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }

 if (ctx.prefix || ctx.suffix) { ;
__p += '\n<div class="input-group">\n  ';
 } ;
__p += '\n  ';
 if (ctx.prefix) { ;
__p += '\n    <div class="input-group-prepend" ref="prefix">\n    <span class="input-group-text">\n      ';
 if(ctx.prefix instanceof HTMLElement){ ;
__p += '\n        ' +
((__t = ( ctx.t(ctx.prefix.outerHTML, { _userInput: true }) )) == null ? '' : __t) +
'\n      ';
 } else{ ;
__p += '\n        ' +
((__t = ( ctx.t(ctx.prefix, { _userInput: true }) )) == null ? '' : __t) +
'\n      ';
 } ;
__p += '\n    </span>\n    </div>\n  ';
 } ;
__p += '\n\n  \n  <div class="container p-0 mb-1">\n    <div class="row">\n      ';
 ctx.categoryComponents.forEach(function(item) { ;
__p += '\n      <div class="col-12 col-md-6 col-lg-4 col-xl-3 mb-1">\n        <div class="vcbox vcbox-checked-' +
((__t = (item.category)) == null ? '' : __t) +
' p-1">\n          <div class="container">\n            <div class="row align-items-center justify-content-start">\n              <span class="fa-stack icon-stack">\n                <i class="fas fa-circle fa-stack-2x circle-icon-' +
((__t = (item.category)) == null ? '' : __t) +
'"></i>\n                <i class="' +
((__t = (item.icon)) == null ? '' : __t) +
' fa-stack-1x"></i>\n              </span>\n              <span class="ml-1">' +
((__t = (item.label)) == null ? '' : __t) +
'</span>\n            </div>\n          </div>\n        </div>\n      </div>\n      ';
 }) ;
__p += '\n    </div>\n  </div>\n\n  <' +
((__t = (ctx.input.type)) == null ? '' : __t) +
'\n    ref="' +
((__t = (ctx.input.ref ? ctx.input.ref : 'input')) == null ? '' : __t) +
'"\n    ';
 for (var attr in ctx.input.attr) { ;
__p += '\n      ' +
((__t = (attr)) == null ? '' : __t) +
'="' +
((__t = (ctx.input.attr[attr])) == null ? '' : __t) +
'"\n    ';
 } ;
__p += '\n    id="' +
((__t = (ctx.instance.id)) == null ? '' : __t) +
'-' +
((__t = (ctx.component.key)) == null ? '' : __t) +
'"\n    aria-labelledby="l-' +
((__t = (ctx.instance.id)) == null ? '' : __t) +
'-' +
((__t = (ctx.component.key)) == null ? '' : __t) +
' ';
 if (ctx.component.description) { ;
__p += 'd-' +
((__t = (ctx.instance.id)) == null ? '' : __t) +
'-' +
((__t = (ctx.component.key)) == null ? '' : __t);
 } ;
__p += '"\n    aria-required="' +
((__t = (ctx.input.ref === 'input' || !ctx.input.ref ? ctx.component.validate.required :
      ctx.component.fields && ctx.component.fields[ctx.input.ref] && ctx.component.fields[ctx.input.ref].required || false)) == null ? '' : __t) +
'"\n  >' +
((__t = (ctx.input.content)) == null ? '' : __t) +
'</' +
((__t = (ctx.input.type)) == null ? '' : __t) +
'>\n  ';
 if (ctx.hasValueMaskInput) { ;
__p += '\n    <input ref="valueMaskInput" />\n  ';
 } ;
__p += '\n\n';
 if (ctx.suffix) { ;
__p += '\n  <div class="input-group-append" ref="suffix">\n    <span class="input-group-text">\n      ';
 if(ctx.suffix instanceof HTMLElement){ ;
__p += '\n        ' +
((__t = ( ctx.t(ctx.suffix.outerHTML, { _userInput: true }) )) == null ? '' : __t) +
'\n      ';
 } else{ ;
__p += '\n        ' +
((__t = ( ctx.t(ctx.suffix, { _userInput: true }) )) == null ? '' : __t) +
'\n      ';
 } ;
__p += '\n    </span>\n  </div>\n';
 } ;
__p += '\n';
 if (ctx.prefix || ctx.suffix) { ;
__p += '\n  </div>\n';
 } ;
__p += '\n';
 if (ctx.component.showCharCount || ctx.component.showWordCount) { ;
__p += '\n<div class="form-text ' +
((__t = (ctx.component.description ? 'pull-right' : 'text-right')) == null ? '' : __t) +
'">\n  ';
 if (ctx.component.showCharCount) { ;
__p += '\n  <span class="text-muted" ref="charcount" aria-live="polite"></span>\n  ';
 } ;
__p += '\n  ';
 if (ctx.component.showWordCount) { ;
__p += '\n  <span class="text-muted" ref="wordcount" aria-live="polite"></span>\n  ';
 } ;
__p += '\n</div>\n';
 } ;

return __p
}
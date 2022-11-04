Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default=function(ctx) {
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }

 if (ctx.prefix || ctx.suffix) { ;
__p += '\r\n<div class="input-group">\r\n  ';
 } ;
__p += '\r\n  ';
 if (ctx.prefix) { ;
__p += '\r\n    <div class="input-group-prepend" ref="prefix">\r\n    <span class="input-group-text">\r\n      ';
 if(ctx.prefix instanceof HTMLElement){ ;
__p += '\r\n        ' +
((__t = ( ctx.t(ctx.prefix.outerHTML, { _userInput: true }) )) == null ? '' : __t) +
'\r\n      ';
 } else{ ;
__p += '\r\n        ' +
((__t = ( ctx.t(ctx.prefix, { _userInput: true }) )) == null ? '' : __t) +
'\r\n      ';
 } ;
__p += '\r\n    </span>\r\n    </div>\r\n  ';
 } ;
__p += '\r\n\r\n  \r\n  <div class="container p-0 mb-1">\r\n    <div class="row">\r\n      ';
 ctx.valueComponents.forEach(function(item) { ;
__p += '\r\n      <div class="col-12 col-md-6 col-lg-4 col-xl-3 mb-1">\r\n        <div class="vcbox vcbox-checked-' +
((__t = (item.category)) == null ? '' : __t) +
' p-1">\r\n          <div class="container">\r\n            <div class="row align-items-center justify-content-start">\r\n              <span class="fa-stack icon-stack">\r\n                <i class="fas fa-circle fa-stack-2x circle-icon-' +
((__t = (item.category)) == null ? '' : __t) +
'"></i>\r\n                <i class="' +
((__t = (item.icon)) == null ? '' : __t) +
' fa-stack-1x"></i>\r\n              </span>\r\n              <span class="ml-1">' +
((__t = (item.label)) == null ? '' : __t) +
'</span>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      ';
 }) ;
__p += '\r\n    </div>\r\n  </div>\r\n\r\n  <' +
((__t = (ctx.input.type)) == null ? '' : __t) +
'\r\n    ref="' +
((__t = (ctx.input.ref ? ctx.input.ref : 'input')) == null ? '' : __t) +
'"\r\n    ';
 for (var attr in ctx.input.attr) { ;
__p += '\r\n      ' +
((__t = (attr)) == null ? '' : __t) +
'="' +
((__t = (ctx.input.attr[attr])) == null ? '' : __t) +
'"\r\n    ';
 } ;
__p += '\r\n    id="' +
((__t = (ctx.instance.id)) == null ? '' : __t) +
'-' +
((__t = (ctx.component.key)) == null ? '' : __t) +
'"\r\n    aria-labelledby="l-' +
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
__p += '"\r\n    aria-required="' +
((__t = (ctx.input.ref === 'input' || !ctx.input.ref ? ctx.component.validate.required :
      ctx.component.fields && ctx.component.fields[ctx.input.ref] && ctx.component.fields[ctx.input.ref].required || false)) == null ? '' : __t) +
'"\r\n  >' +
((__t = (ctx.input.content)) == null ? '' : __t) +
'</' +
((__t = (ctx.input.type)) == null ? '' : __t) +
'>\r\n  ';
 if (ctx.hasValueMaskInput) { ;
__p += '\r\n    <input ref="valueMaskInput" />\r\n  ';
 } ;
__p += '\r\n\r\n';
 if (ctx.suffix) { ;
__p += '\r\n  <div class="input-group-append" ref="suffix">\r\n    <span class="input-group-text">\r\n      ';
 if(ctx.suffix instanceof HTMLElement){ ;
__p += '\r\n        ' +
((__t = ( ctx.t(ctx.suffix.outerHTML, { _userInput: true }) )) == null ? '' : __t) +
'\r\n      ';
 } else{ ;
__p += '\r\n        ' +
((__t = ( ctx.t(ctx.suffix, { _userInput: true }) )) == null ? '' : __t) +
'\r\n      ';
 } ;
__p += '\r\n    </span>\r\n  </div>\r\n';
 } ;
__p += '\r\n';
 if (ctx.prefix || ctx.suffix) { ;
__p += '\r\n  </div>\r\n';
 } ;
__p += '\r\n';
 if (ctx.component.showCharCount || ctx.component.showWordCount) { ;
__p += '\r\n<div class="form-text ' +
((__t = (ctx.component.description ? 'pull-right' : 'text-right')) == null ? '' : __t) +
'">\r\n  ';
 if (ctx.component.showCharCount) { ;
__p += '\r\n  <span class="text-muted" ref="charcount" aria-live="polite"></span>\r\n  ';
 } ;
__p += '\r\n  ';
 if (ctx.component.showWordCount) { ;
__p += '\r\n  <span class="text-muted" ref="wordcount" aria-live="polite"></span>\r\n  ';
 } ;
__p += '\r\n</div>\r\n';
 } ;

return __p
}
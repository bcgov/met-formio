Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default=function(ctx) {
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
__p += '<div\n  class="form-radio radio"\n  ref="radioGroup"\n  role="group"\n  aria-required="' +
((__t = (ctx.input.component.validate.required)) == null ? '' : __t) +
'"\n  aria-labelledby="l-' +
((__t = (ctx.instance.id)) == null ? '' : __t) +
'-' +
((__t = (ctx.component.key)) == null ? '' : __t) +
'"\n  ';
 if (ctx.component.description) { ;
__p += '\n    aria-describedby="d-' +
((__t = (ctx.instance.id)) == null ? '' : __t) +
'-' +
((__t = (ctx.component.key)) == null ? '' : __t) +
'"\n  ';
 } ;
__p += '\n>\n  <div class="container p-0 m-1">\n    <div class="row">\n      ';
 ctx.values.forEach(function(item) { ;
__p += '\n        ';
 var isChecked = ctx.value && (ctx.value === item.value || (typeof ctx.value === 'object' && ctx.value.hasOwnProperty(item.value) && ctx.value[item.value])) ;
__p += '\n            <div class="col-12 col-md-6 col-lg-6 col-xl-4 mb-4">\n              <div class="container vcbox ' +
((__t = ( isChecked ? `vcbox-checked-${item.category}` : '' )) == null ? '' : __t) +
' p-1">\n                <div class="row align-items-center justify-content-start">\n                  <div class="col-8">\n                    <div class="container">\n                      <div class="row align-items-center justify-content-start">\n                        <span class="fa-stack icon-stack">\n                          <i class="fas fa-circle fa-stack-2x circle-icon-' +
((__t = (item.category)) == null ? '' : __t) +
'"></i>\n                          ';
 if (item.icon) { ;
__p += '\n                            <i class="' +
((__t = (item.icon)) == null ? '' : __t) +
' fa-stack-1x"></i>\n                          ';
 } ;
__p += '\n                        </span>\n                        <span class="ml-1">' +
((__t = (item.label)) == null ? '' : __t) +
'</span>\n                        \n                      </div>\n                    </div>\n                  </div>\n                  <div class="col">\n                    <div class="container">\n                      <div class="row justify-content-end">\n                        <input\n                          type="checkbox"\n                          ref="input"\n                          value="' +
((__t = (item.value)) == null ? '' : __t) +
'"\n                          ';
 if (isChecked) { ;
__p += '\n                            checked=true\n                          ';
 } ;
__p += '\n                          ';
 if (item.disabled) { ;
__p += '\n                            disabled=true\n                          ';
 } ;
__p += '\n                          id="' +
((__t = (ctx.instance.root && ctx.instance.root.id)) == null ? '' : __t) +
'-' +
((__t = (ctx.id)) == null ? '' : __t) +
'-' +
((__t = (ctx.row)) == null ? '' : __t) +
'-' +
((__t = (item.value)) == null ? '' : __t) +
'"\n                          role="checkbox"\n                          class="cc-checked"\n                          name="' +
((__t = (ctx.component.key)) == null ? '' : __t) +
'"\n                        >\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n          ';
 }) ;
__p += '\n    </div>\n  </div>\n</div>\n';
return __p
}
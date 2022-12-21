Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default=function(ctx) {
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
__p += '<div\r\n  class="form-radio radio"\r\n  ref="radioGroup"\r\n  role="group"\r\n  aria-required="' +
((__t = (ctx.input.component.validate.required)) == null ? '' : __t) +
'"\r\n  aria-labelledby="l-' +
((__t = (ctx.instance.id)) == null ? '' : __t) +
'-' +
((__t = (ctx.component.key)) == null ? '' : __t) +
'"\r\n  ';
 if (ctx.component.description) { ;
__p += '\r\n    aria-describedby="d-' +
((__t = (ctx.instance.id)) == null ? '' : __t) +
'-' +
((__t = (ctx.component.key)) == null ? '' : __t) +
'"\r\n  ';
 } ;
__p += '\r\n>\r\n  <div class="container p-0 m-1">\r\n    <div class="row">\r\n      ';
 ctx.values.forEach(function(item) { ;
__p += '\r\n        ';
 var isChecked = ctx.value && (ctx.value === item.value || (typeof ctx.value === 'object' && ctx.value.hasOwnProperty(item.value) && ctx.value[item.value])) ;
__p += '\r\n            <div class="col-12 col-md-6 col-lg-6 col-xl-4 mb-4">\r\n              <div class="container vcbox ' +
((__t = ( isChecked ? `vcbox-checked-${item.category}` : '' )) == null ? '' : __t) +
' p-1">\r\n                <div class="row align-items-center justify-content-start">\r\n                  <div class="col-8">\r\n                    <div class="container">\r\n                      <div class="row align-items-center justify-content-start">\r\n                        <span class="fa-stack icon-stack">\r\n                          <i class="fas fa-circle fa-stack-2x circle-icon-' +
((__t = (item.category)) == null ? '' : __t) +
'"></i>\r\n                          ';
 if (item.icon) { ;
__p += '\r\n                            <i class="' +
((__t = (item.icon)) == null ? '' : __t) +
' fa-stack-1x"></i>\r\n                          ';
 } ;
__p += '\r\n                        </span>\r\n                        <span class="ml-1">' +
((__t = (item.label)) == null ? '' : __t) +
'</span>\r\n                        \r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n                  <div class="col">\r\n                    <div class="container">\r\n                      <div class="row justify-content-end">\r\n                        <input\r\n                          type="checkbox"\r\n                          ref="input"\r\n                          value="' +
((__t = (item.value)) == null ? '' : __t) +
'"\r\n                          ';
 if (isChecked) { ;
__p += '\r\n                            checked=true\r\n                          ';
 } ;
__p += '\r\n                          ';
 if (item.disabled) { ;
__p += '\r\n                            disabled=true\r\n                          ';
 } ;
__p += '\r\n                          id="' +
((__t = (ctx.instance.root && ctx.instance.root.id)) == null ? '' : __t) +
'-' +
((__t = (ctx.id)) == null ? '' : __t) +
'-' +
((__t = (ctx.row)) == null ? '' : __t) +
'-' +
((__t = (item.value)) == null ? '' : __t) +
'"\r\n                          role="checkbox"\r\n                          class="cc-checked"\r\n                          name="' +
((__t = (ctx.component.key)) == null ? '' : __t) +
'"\r\n                        >\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          ';
 }) ;
__p += '\r\n    </div>\r\n  </div>\r\n</div>\r\n';
return __p
}
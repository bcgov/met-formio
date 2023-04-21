Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default=function(ctx) {
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
__p += '<table class="' +
((__t = ( ctx.tableClass )) == null ? '' : __t) +
'">\r\n    <tbody>\r\n        ';
 for (let i = 0; i < ctx.component.numRows; i++) { ;
__p += '\r\n            <tr>\r\n                ';
 for (let j = 0; j < ctx.component.numCols; j++) { ;
__p += '\r\n                    <td>' +
((__t = ( ctx.renderCell(i, j) )) == null ? '' : __t) +
'</td>\r\n                ';
 } ;
__p += '\r\n            </tr>\r\n        ';
 } ;
__p += '\r\n    </tbody>\r\n</table>\r\n';
return __p
}
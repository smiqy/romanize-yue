"use strict";function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _iterableToArray(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e)){for(var r=0,t=new Array(e.length);r<e.length;r++)t[r]=e[r];return t}}function _slicedToArray(e,r){return _arrayWithHoles(e)||_iterableToArrayLimit(e,r)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function _iterableToArrayLimit(e,r){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)){var t=[],n=!0,u=!1,c=void 0;try{for(var a,i=e[Symbol.iterator]();!(n=(a=i.next()).done)&&(t.push(a.value),!r||t.length!==r);n=!0);}catch(e){u=!0,c=e}finally{try{n||null==i.return||i.return()}finally{if(u)throw c}}return t}}function _arrayWithHoles(e){if(Array.isArray(e))return e}var fs=require("fs"),pathEmc="rime-middle-chinese/zyenpheng.dict.yaml",textEmc=fs.readFileSync(pathEmc,"utf8"),reduceReplace=function(e,r){return r.reduce(function(e,r){var t=_slicedToArray(r,2),n=t[0],u=t[1];return e.replace(n,u)},e)},textEmcNew=textEmc.split("\n").filter(function(e){return/^(?:[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FEF\uF900-\uFA6D\uFA70-\uFAD9]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D])\t/g.test(e)}).slice(31).join("\n").replace(/[a-z']+/g,function(e){var r=0,t=e;return/x$/.test(t)?(r=1,t=t.slice(0,-1)):/h$/.test(t)?(r=2,t=t.slice(0,-1)):/d$/.test(t)?r=2:/[ktp]$/.test(t)&&(r=3),(t=[[/ng/g,"ŋ"],[/k$/,"ŋ"],[/t$/,"n"],[/p$/,"m"],[/h/,"x"],[/^z(?!s)/,"ʣ"],[/^c/,"ʦ"],[/^zs/,"z"],[/^gx/,"h"],[/(?<!^)xr/,"rx"],[/xj/,"jx"],[/^k/,"c"],[/xj/,"j"],[/xj/,"jx"]].reduce(function(e,r){var t=_slicedToArray(r,2),n=t[0],u=t[1];return e.replace(n,u)},t))+r}),emc={};textEmcNew.split("\n").map(function(e){return e.trim().split("\t")}).filter(function(e){return 1==_slicedToArray(e,1)[0].length}).map(function(e){var r,t=_slicedToArray(e,3),n=t[0],u=t[1],c=t[2];(!c||30<=parseInt(c.match(/(\d+)%/)))&&(r=u.match(/(.+)(\d)/).slice(1),emc[n]?emc[n].push(r):emc[n]=[r])}),fs.writeFileSync("../docs/romanization-emc.js","const mapEmc = {\n".concat(Object.entries(emc).map(function(e){var r=_slicedToArray(e,2),t=r[0],n=r[1];return'  "'.concat(t,'": [').concat(n.map(function(e){var r=_slicedToArray(e,2),t=r[0],n=r[1];return'"'.concat(t.replace(/j/g,"ȷ").replace(/i/g,"ı")).concat("̄́̀̍".charAt(parseInt(n)),'"')}).join(", "),"]")}).join(",\n"),"\n};")),pathYue="jyutping-table/list.tsv",textYue=fs.readFileSync(pathYue,"utf8");var voice=function(e){return{g:"c",d:"t","ʣ":"ʦ",b:"p"}[e]},yue={};textYue.trim().split("\r\n").slice(1).map(function(e){var r=_slicedToArray(e.split("\t"),6),t=r[0],n=(r[1],r[2]),u=(r[3],r[4],r[5]),c=n.replace(/[1-6]$/,"");if(1==c.split(" ").length&&(!/[ktp]$/.test(c)||["1","3","6"].includes(u))&&"ngm"!=c){/[ktp]$/.test(c)&&(u={1:"7",3:"7",6:"8"}[u],c=c.replace(/k$/,"ng").replace(/t$/,"n").replace(/p$/,"m")),c=c.replace(/^k/,"kh").replace(/^t/,"th").replace(/^c/,"ch").replace(/^p/,"ph").replace(/^g/,"k").replace(/^d/,"t").replace(/^z/,"c").replace(/^b/,"p").replace(/ng/g,"ŋ").replace(/yu/,"y").replace(/oe|eo/,"ø").replace(/j(?=[iyø])/,"").replace(/w/,"v").replace(/v(?=u)/,"").replace(/a/g,"ə").replace(/əə/,"a").replace(/c/,"ʦ").replace(/z/,"ʣ").replace(/k/g,"c").replace(/h/,"x"),c=["1","2","3","7"].includes(u=u)?c.replace(/^(?=[ŋnmljviyueøoəa])/,"q"):c.replace(/^s/,"z").replace(/^x/,"h").replace(/^f/,"w").replace(/^p/,"b").replace(/^c/,"g").replace(/^t/,"d").replace(/^ʦ/,"ʣ"),u={1:0,2:1,3:2,4:0,5:1,6:2,7:3,8:3}[u];var a=emc[t];if(a&&1<=a.length){for(var i=0,o=["ŋ","n","m"];i<o.length;i++){if("break"===function(){var r=o[i];if(a.some(function(e){return new RegExp("^"+r).test(e[0])}))return c=c.replace(/(?<=^q?)(?=[iyueøoaəjv])/,"".concat(r,"’")),"break"}())break}c=c.replace(/n’j/,"nj").replace(/(?<=n)’(?=[iyø])/,"j").replace(/(?<=ŋ)’(?=[iyj])/,"");for(var l=0,p=[[/^[dtʣʦzs]j/,/(?<=^[ʣʦzs])/,"j"],[/^[dtʣʦzs]r/,/(?<=^[ʣʦzs])/,"r"],[/^[gchx]/,/^f/,"xv"],[/^[gchx]/,/^w/,"hv"],[/^[gcxh]/,/(?=^[iyueøoəajv])/,"h’"],[/^[gcxh]/,/^q(?=[iyueøoəajv])/,"x’"]];l<p.length;l++){if("break"===function(){var e=_slicedToArray(p[l],3),r=e[0],t=e[1],n=e[2];if(a.every(function(e){return r.test(e[0])})&&t.test(c))return c=c.replace(t,n),"break"}())break}c=c.replace(/(?<=^h)’(?=[jvy])/,"").replace(/’(?=u)/,"v").replace(/(?<=[xh])v(?=u)/,"").replace(/’(?=[iyø])/,"j").replace(/(?<=^[xnm])’(?=j)/,"").replace(/(?<=^ŋ)’(?=[jiyø])/,"").replace(/(?<=[ŋnm])’(?=v)/,"").replace(/(?<=ŋ)’(?=[iyueøoəa])/,"")}c=(c=c.replace(/(?<!^)xv/,"vx").replace(/(?<!^)xj/,"jx").replace(/(?<!^)xr/,"rx")).replace(/j/,"ȷ").replace(/i/,"ı"),n=c+["̀","́","̄","̍"][u],a&&(/^q?ŋ/.test(c)&&!a.some(function(e){return/^ŋ/.test(e[0])})||/^q?n/.test(c)&&!a.some(function(e){return/^n/.test(e[0])})||/^q?m/.test(c)&&!a.some(function(e){return/^m/.test(e[0])}))||(yue[t]?yue[t].includes(n)||yue[t].some(function(e){return e.replace(/.$/,"")==n.replace(/q(?=[ŋnml])/,"").replace(/.$/,"")})||yue[t].some(function(e){return e.replace(/.$/,"")==n.replace(/(?<=[gdʣb][rj]?)x/,"").replace(/.$/,"")})||yue[t].some(function(e){return e.replace(/.$/,"")==n.replace(/^./,voice).replace(/.$/,"")})||yue[t].some(function(e){return e==n.replace(/^l/,"n")})||yue[t].some(function(e){return e.replace(/.$/,"")==n.replace(/^ql(.+).$/,"n$1")})||yue[t].includes(n.replace(/(?<=[cg]x?)/,"v"))||yue[t].push(n):yue[t]=[n])}});for(var _loop3=function(){var e=_slicedToArray(_Object$entries[_i4],2),t=e[0],n=e[1],r=!0,u=!1,c=void 0;try{for(var a,i=n[Symbol.iterator]();!(r=(a=i.next()).done);r=!0)!function(){var r=a.value;/^[ŋnml]/.test(r)&&(yue[t]=n.filter(function(e){return e!="q"+r}))}()}catch(e){u=!0,c=e}finally{try{r||null==i.return||i.return()}finally{if(u)throw c}}var o=!0,l=!1,p=void 0;try{for(var s,D=n[Symbol.iterator]();!(o=(s=D.next()).done);o=!0)!function(){var r=s.value;/^[gdʣb](?!x)/.test(r)&&(yue[t]=n.filter(function(e){return e!=r.charAt(0)+"x"+n.slice(1)})),/^[ctʦp]x/.test(r)&&(yue[t]=n.filter(function(e){return e!=voice(r.charAt(0))+n.slice(1)}))}()}catch(e){l=!0,p=e}finally{try{o||null==D.return||D.return()}finally{if(l)throw p}}},_i4=0,_Object$entries=Object.entries(yue);_i4<_Object$entries.length;_i4++)_loop3();fs.writeFileSync("../docs/romanization-yue.js","const mapYue = {\n".concat(Object.entries(yue).map(function(e){var r=_slicedToArray(e,2),t=r[0],n=r[1];return'  "'.concat(t,'": [').concat(n.map(function(e){return'"'.concat(e,'"')}).join(", "),"]")}).join(",\n"),"\n};"));for(var pinyin=require("pinyin/data/dict-zi"),cmn={},_loop4=function(){var e,r=_slicedToArray(_Object$entries2[_i5],2),t=r[0],n=r[1],p=String.fromCharCode(t);p.match(/(?:[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FEF\uF900-\uFA6D\uFA70-\uFAD9]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D])/)&&(cmn[p]||(cmn[p]=[]),e=n.split(",").map(function(e){var r={"̄":"́","́":"̌","̌":"̀","̀":"̂",null:"̇"}[(e=e.normalize("NFD")).match(/[\u0304\u0301\u030C\u0300]/)],t=reduceReplace(e.replace(/[\u0304\u0301\u030C\u0300]/,"").normalize("NFC"),[[/ng$/,"ŋ"],[/(?<=^[zcs])h/,"r"],[/(?<=[zcsr])i/,""],[/(?<=^[bpmf])o/,"uo"],[/(?<=^[jqx])u/,"ü"],[/^j/,"g"],[/^q/,"k"],[/^h/,"x"],[/^yi/,"i"],[/^yu/,"ü"],[/^wu/,"u"],[/y/,"i"],[/ü/,"y"],[/w/,"u"],[/ioŋ$/,"yeŋ"],[/ao$/,"au"],[/ou$/,"eu"],[/uo$/,"ue"],[/(?<=[iy])(?=[ŋn]$)/,"e"],[/iu$/,"ieu"],[/ui$/,"uei"],[/un$/,"uen"],[/oŋ$/,"ueŋ"],[/c/g,"ʦ"],[/z/g,"ʣ"],[/k/g,"c"]]),n=emc[p];if(n&&1<=n.length){n.some(function(e){return/^m/.test(e[0])})?t=t.replace(/^(?=u)/,"m"):n.some(function(e){return/^ŋ/.test(e[0])})?t=t.replace(/^(?=[iyuea])/,"ŋ"):n.some(function(e){return/^nr/.test(e[0])})?t=t.replace(/^r/,"nr").replace(/^er$/,"enr"):n.some(function(e){return/^n[ij]/.test(e[0])})?t=t.replace(/^r/,"nj").replace(/^er$/,"enj"):n.some(function(e){return/^[ij]/.test(e[0])})&&(t=t.replace(/^r/,"j").replace(/^er$/,"ej")),n.some(function(e){return/^[ʣʦsz]r/.test(e[0])})?t=t.replace(/^g/,"ʣr").replace(/^k/,"ʦr").replace(/^x/,"sr"):n.some(function(e){return/^[ʣʦsz]j/.test(e[0])})?t=t.replace(/^g/,"ʣj").replace(/^k/,"ʦj").replace(/^x/,"sj").replace(/(?<=^[ʣʦs])r/,"j"):n.some(function(e){return/^[ʣʦsz]/.test(e[0])})&&(t=t.replace(/^g/,"ʣ").replace(/^k/,"ʦ").replace(/^x/,"s"));var u=!0,c=!1,a=void 0;try{for(var i,o=n[Symbol.iterator]();!(u=(i=o.next()).done);u=!0){var l=i.value;if(/[ŋnm]$/.test(l[0])&&3==l[1]){t+={"ŋ":"c",n:"t",m:"p"}[l[0].slice(-1)];break}}}catch(e){c=!0,a=e}finally{try{u||null==o.return||o.return()}finally{if(c)throw a}}}return(t=t.replace(/i/g,"ı").replace(/j/g,"ȷ"))+r}),cmn[p]=cmn[p].concat(e))},_i5=0,_Object$entries2=Object.entries(pinyin);_i5<_Object$entries2.length;_i5++)_loop4();fs.writeFileSync("../docs/romanization-cmn.js","const mapCmn = {\n".concat(Object.entries(cmn).map(function(e){var r=_slicedToArray(e,2),t=r[0],n=r[1];return'  "'.concat(t,'": [').concat(n.map(function(e){return'"'.concat(e,'"')}).join(", "),"]")}).join(",\n"),"\n};"));for(var cmnSimple={},_i6=0,_Object$entries3=Object.entries(pinyin);_i6<_Object$entries3.length;_i6++){var addition,_Object$entries3$_i=_slicedToArray(_Object$entries3[_i6],2),k=_Object$entries3$_i[0],v=_Object$entries3$_i[1],c=String.fromCharCode(k);c.match(/(?:[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FEF\uF900-\uFA6D\uFA70-\uFAD9]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D])/)&&(cmnSimple[c]||(cmnSimple[c]=[]),addition=v.split(",").map(function(e){var r={"̄":"́","́":"̌","̌":"̀","̀":"̂",null:"̇"}[(e=e.normalize("NFD")).match(/[\u0304\u0301\u030C\u0300]/)];return reduceReplace(e.replace(/[\u0304\u0301\u030C\u0300]/,"").normalize("NFC"),[[/ng$/,"ŋ"],[/(?<=[zcs])h/,"̣"],[/(?<=[\u0323r])i$/,""],[/(?<=^[bpmf])o/,"uo"],[/(?<=^[jqx])u/,"ü"],[/^j/,"g"],[/^q/,"k"],[/^h/,"x"],[/^yi/,"i"],[/^yu/,"ü"],[/^wu/,"u"],[/y/,"i"],[/ü/,"y"],[/w/,"u"],[/ioŋ$/,"yeŋ"],[/ao$/,"au"],[/ou$/,"eu"],[/uo$/,"ue"],[/(?<=[iy])(?=[ŋn]$)/,"e"],[/iu$/,"ieu"],[/ui$/,"uei"],[/un$/,"uen"],[/oŋ$/,"ueŋ"],[/(?<=[iuy])e(?=[iunŋ])/,""],["b","б"],["p","п"],["f","ф"],["m","м"],["d","д"],["t","т"],["n","н"],["l","л"],["ẓ","ж"],["c̣","ч"],["ṣ","ш"],["ṛ","р"],["z","ѕ"],["c","ц"],["s","с"],["g","г"],["k","к"],["x","х"],["ŋ","ӈ"],["i","и"],["y","ѵ"],["u","у"],["e","э"],["a","а"]])+r}),cmnSimple[c]=cmnSimple[c].concat(addition))}fs.writeFileSync("../docs/romanization-cmn-simple.js","const mapCmnSimple = {\n".concat(Object.entries(cmnSimple).map(function(e){var r=_slicedToArray(e,2),t=r[0],n=r[1];return'  "'.concat(t,'": [').concat(n.map(function(e){return'"'.concat(e,'"')}).join(", "),"]")}).join(",\n"),"\n};")),_toConsumableArray("成功").forEach(function(e){return console.log(yue[e].join(" "))});for(var _i7=0,_arr4=["yue","cmn","cmn-simple"];_i7<_arr4.length;_i7++){var lang=_arr4[_i7];fs.copyFile("../docs/romanization-".concat(lang,".js"),"../plugin/romanization-".concat(lang,".js"),function(e){if(e)throw e})}
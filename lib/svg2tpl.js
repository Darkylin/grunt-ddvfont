// 将svg转为tpl文件
var fs = require('fs');
var reader = require('buffered-reader');
var path = require('path');

var DataReader = reader.DataReader;

function trasfer(filePath,cb) {
    var templ = '',
        // 从svg中每一行数据中提取
        replaceReg = /(id|font-family|glyph-name|unicode)="([^"]*)"/g,
        // 从unicode码中提取数字对应char，"&#x30;"对应0。拿取;前的数字
        getCharReg = /\d(?=;)/;
    return new DataReader(filePath, {encoding: 'utf8'})
        .on('error', function (error) {
            fs.exists(filePath, function (e) {
                !e && console.error('文件不存在，请使用绝对路径')
            });
            console.error(error);
        })
        // 替换
        // id = {{fontName}}
        // font-family = {{fontName}}
        // glyph-name[?] = {{mapping[?]}}
        // unicode[?] = &#x3{{mapping[?]}}
        .on('line', function (line) {
            var char;
            line = line.replace(replaceReg,function(m,$1,$2){
                switch($1) {
                    case 'id':return 'id="{{{fontName}}}"';
                    case 'font-family': return 'font-family="{{{fontName}}}"';
                    case 'glyph-name': return 'glyph-name="{{arr mapping '+$2+'}}"';
                    case 'unicode': return 'unicode="&#x3{{arr mapping '+getCharReg.exec($2)+'}};"';
                }
            });
            templ+=line+'\n';
        })
        .on('end', function () {
            fs.writeFile('../resources/tpl/'+path.basename(filePath,'.svg')+".tpl",templ,function(){
                cb&&cb();
            });
        })
        .read();
}
trasfer('../resources/svg/helvetica.svg', function(){
    console.log("success")
});


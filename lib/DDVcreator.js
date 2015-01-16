/**
 * Created by Darkylin on 12/29/14.
 */
var fs = require('fs');
var fse = require('fs-extra')
var svg2ttf = require('svg2ttf');
var util = require('./util');
var Handlebars = require('handlebars');
var path = require('path');
var Q = require('q');

Handlebars.registerHelper('arr', function (arr, index) {
    return arr[index];
});
Handlebars.registerHelper('span', function (str) {
    var arr = str.split(''), rtn = '';
    for (var i in arr) {
        rtn += '<span>' + arr[i] + '</span>';
    }
    return new Handlebars.SafeString(rtn);
});
function create(conf) {
    conf = util.extend({
        fontName: function () {
            return 'ddv' + ((new Date).getTime() + Math.floor(Math.random() * 1000)).toString(32);
        },
        fontFamily: 'helvetica',
        amount: 10,
        ttfDir: 'temp/ttf',
        mapPath: 'temp/conf.json',
        mapType: 'json',
        htmlPath: 'temp/index.html',
        htmlTemplate: 'index',
        generateHtml: true
    }, conf);
    conf.ttfDir = path.normalize(conf.ttfDir);

    //计数器标识是否完成了全部异步操作
    //+1是在等待生成配置文件
    var remainderCount = conf.amount + 1, failError = null;

    fs.readFile(path.join(__dirname, '../resources/tpl/' + conf.fontFamily + '.tpl'), {encoding: 'utf8'}, function (err, data) {

        if (err) {
            //TODO 重新生成.tpl
            console.error(err);
            return;
        }

        var tpl = Handlebars.compile(data);
        var mapping = {};
        // 生成测试html用字体所在目录
        var ttf4htmlDir = path.normalize(path.join(path.dirname(conf.htmlPath), 'ttf'));

        // 清空即将输出ttf的目录
        function clearPromise(dir) {
            function existsOrNot(exists) {
                if (exists) {
                    return Q.Promise(
                        function (resolve) {
                            remainderCount++;
                            util.clearDir(dir, function(e){
                                fileCallback(e);
                                resolve();
                            });
                        }
                    );
                } else {
                    return Q.nfcall(fse.mkdirs, dir);
                }
            }

            return Q.nfcall(fs.exists, dir)
                .then(existsOrNot, existsOrNot);
        }


        var readyQueue = [];
        readyQueue.push(clearPromise(conf.ttfDir));
        if (conf.generateHtml && ttf4htmlDir != conf.ttfDir) {
            readyQueue.push(clearPromise(ttf4htmlDir));
        }
        //清空完成后开始生成字体
        Q.all(readyQueue).done(createTTF);

        function createTTF() {
            var i = conf.amount;
            while (i--) {
                // 映射表，形如：[ 9, 7, 8, 4, 3, 2, 0, 6, 1, 5 ]
                // 代表9的字形为0，789实际展示字形为120。
                var map = util.createRandomArrayFrom0To9();
                var fontName = conf.fontName();
                var svg = tpl({
                    fontName: fontName,
                    mapping: map
                });
                var ttf = svg2ttf(svg, {});
                mapping[fontName] = map.join('');
                var ttfPath = path.join(conf.ttfDir, fontName + '.ttf');
                var ttfBuffer = new Buffer(ttf.buffer);
                //生成字体
                fs.writeFile(ttfPath, ttfBuffer, function (err) {
                    fileCallback(err);
                });
                //生成测试html用字体
                if (conf.generateHtml && ttf4htmlDir != conf.ttfDir) {
                    fs.writeFile(path.join(ttf4htmlDir, fontName + '.ttf'), ttfBuffer);
                }
            }
            if (conf.mapType == 'json') {
                fse.writeJSONFile(conf.mapPath, mapping, fileCallback);
            } else if (conf.mapType == 'string') {
                var mappingStrArr = [];
                for (var i in mapping) {
                    mappingStrArr.push(i + ':' + mapping[i]);
                }
                fs.writeFile(conf.mapPath, mappingStrArr.join(','), fileCallback);
            }
            //生成测试HTML
            if (conf.generateHtml) {
                remainderCount += 2;
                mapping.standard = '0123456789';
                //复制ddv标准字体到html输出目录的ttf子目录下
                fse.copy(path.join(__dirname, '../resources/ttf', conf.fontFamily + '-ddvStandard.ttf'),
                    path.join(ttf4htmlDir, 'standard.ttf'),
                    fileCallback);
                fs.readFile(path.join(__dirname, '../resources/tpl/', conf.htmlTemplate + '.html.tpl'), function (err, data) {
                    fs.writeFile(conf.htmlPath, Handlebars.compile(data.toString())(mapping), fileCallback);
                });
            }
        }


    });
    var doneCB = [];
    var failCB = [];
    //为数组扩展exec方法。
    util.extendExec(doneCB, failCB);

    function fileCallback(err) {
        if (err) {
            failError = err;
            if(!failCB.length){
                console.error(err);
            }else{
                failCB.exec(err);
            }
        } else {
            remainderCount--;
            if (remainderCount <= 0) {
                doneCB.exec();
            }
        }
    }

    return {
        'done': function (cb) {
            if (remainderCount <= 0) {
                cb && cb();
            } else {
                doneCB.push(cb);
            }
        },
        'error': function (cb) {
            if (failError) {
                cb && cb();
            } else {
                failCB.push(cb);
            }
        }
    }
}
module.exports.create = create;
var random = require('random-js')();

function createArray(ascStart, ascEnd) {
    var candidate = [], i = ascStart;
    while (i <= ascEnd) {
        candidate.push(String.fromCharCode(i++));
    }
    return candidate;
}

function randomSort(arr) {
    var rtn = [], i = arr.length;
    while (i--) {
        var index = random.integer(0, i);
        rtn.push(arr[index]);
        arr.splice(index, 1);
    }
    return rtn;
}
//合并对象，传参后面的对象覆盖前面对象的属性
function extend() {
    return [].slice.call(arguments).reduceRight(function (prev, curr) {
        var key;
        for (key in prev) {
            curr[key] = prev[key];
        }
        return curr;
    });
}
//对传入的数组对象添加一个新的方法exec，由前向后执行数组中的所有函数
function extendExec() {
    var i = 0, lim = arguments.length;
    for (; i < lim; i++) {
        Object.defineProperty(arguments[i], 'exec', {
            'value': function () {
                this.forEach(function (item) {
                    if (item instanceof Function) {
                        item.apply(null, arguments);
                    }
                });
            },
            writable: false,
            enumerable: false,
            configurable: false
        })
    }
}
module.exports.createRandomArrayFrom0To9 = function () {
    var arr = createArray(48, 57);
    return randomSort(arr);
};

var fse = require('fs-extra')
//清空一个目录，如果没有新建之。
function clearDir(dirPath, callback){
    fse.remove(dirPath,function(e){
        if(e){
            console.error(e)
        }else{
            fse.ensureDir(dirPath,callback);
        }
    });
}
clearDir('test');
module.exports.extend = extend;
module.exports.extendExec = extendExec;
module.exports.clearDir = clearDir;
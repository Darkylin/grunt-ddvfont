/*
 * ddvfont
 *
 * Copyright (c) 2015 Darkylin
 */

'use strict';

module.exports = function(grunt) {

    grunt.registerMultiTask('ddvfont', 'ddv for crawler', function() {
        //console.log(this);
        var ddv = require('./DDVcreator'),done=this.async();
        switch(this.target){
            case 'create':ddv.create(this.options()).done(done);break;
            default:grunt.log('任务目标目前仅支持 create');
        }
    });

};

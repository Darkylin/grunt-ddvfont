/*
 * ddvfont
 *
 *
 * Copyright (c) 2015 Darkylin
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        ddvfont: {
            create: {
                options: {
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
                }
            }
        }
    });
    grunt.loadTasks('tasks');

};

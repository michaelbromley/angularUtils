module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            src: [
                'src/**/*.js'
            ],
            options: {
                curly: true,
                immed: true,
                newcap: true,
                noarg: true,
                sub: true,
                boss: true,
                eqnull: true
            }
        },

        karma: {
            unit: {
                options: {
                    files: [
                        'vendor/angular/angular.js',
                        'vendor/angular/angular-mocks.js',
                        'src/angularUtils.js',
                        'src/filters/ordinalDate/ordinalDate.js',
                        'src/filters/ordinalDate/ordinalDate.spec.js'
                        //'src/**/*.js'
                    ],
                    frameworks: [ 'jasmine' ],
                    plugins: [ 'karma-jasmine', 'karma-firefox-launcher', 'karma-chrome-launcher', 'karma-phantomjs-launcher' ]

                },
                singleRun: true,
                port: 9877
            }
        }

    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint', 'karma']);

};
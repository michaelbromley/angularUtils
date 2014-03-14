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
                        'vendor/jquery/jquery-2.1.0.min.js', // jQuery is included for the purposes of easier DOM selection when testing directives.
                        'vendor/angular/angular.js',
                        'vendor/angular/angular-mocks.js',
                        'src/angularUtils.js',
                        'src/filters/**/*.js',
                        'src/filters/**/*.spec.js',
                        'src/directives/**/*.js',
                        'src/directives/**/*.spec.js',
                        'src/services/**/*.js',
                        'src/services/**/*.spec.js'
                    ],
                    frameworks: [ 'jasmine' ],
                    plugins: [ 'karma-jasmine', 'karma-firefox-launcher', 'karma-chrome-launcher', 'karma-phantomjs-launcher' ]

                },
                singleRun: true,
                port: 9877,
                browsers: [
                    'PhantomJS'
                ]
            }
        }

    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint', 'karma']);

};
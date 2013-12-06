module.exports = function(grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        paths: {
            front: 'public',
            back: 'app',
            dist: 'dist',
            test: 'test',
            testFront: 'test/public',
            testBack: 'test/app'
        },
        watch: {
            jade: {
                files: ['<%= paths.back %>/views/**'],
                options: {
                    livereload: true,
                },
            },
            js: {
                files: ['<%= paths.front %>/js/**', '<%= paths.back %>/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true,
                },
            },
            html: {
                files: ['<%= paths.front %>/views/**'],
                options: {
                    livereload: true,
                },
            },
            compass: {
                files: ['<%= paths.front %>/styles/sass/**/*.{scss, sass}'],
                tasks: ['compass:server'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            all: [
                'gruntfile.js',
                '<%= paths.front %>/js/**/*.js',
                '<%= paths.test %>/**/*.js',
                '<%= paths.back %>/**/*.js'
            ]
        },
        nodemon: {
            dev: {
                options: {
                    file: 'server.js',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['<%= paths.back %>', 'config'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        karma: {
            unit: {
                configFile: '<%= paths.testFront %>/karma-unit.conf.js',
                autoWatch: false,
                singleRun: true
            },
            unit_auto: {
                configFile: '<%= paths.testFront %>/karma-unit.conf.js'
            },
            midway: {
                configFile: '<%= paths.testFront %>/karma-midway.conf.js',
                autoWatch: false,
                singleRun: true
            },
            midway_auto: {
                configFile: '<%= paths.testFront %>/karma-midway.conf.js'
            },
            e2e: {
                configFile: '<%= paths.testFront %>/karma-e2e.conf.js',
                autoWatch: false,
                singleRun: true
            },
            e2e_auto: {
                configFile: '<%= paths.testFront %>/karma-e2e.conf.js'
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec',
                require: [
                    '<%= paths.testBack %>/common.js'
                ]
            },
            src: ['<%= paths.testBack %>/**/*.js']
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        compass: {
            options: {
                sassDir: '<%= paths.front %>/styles/sass',
                cssDir: '<%= paths.front %>/styles/css',
                importPath: '<%= paths.front %>/lib'
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        }
    });

    //Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-contrib-compass');

    //Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    //Default task(s).
    grunt.registerTask('default', ['compass', 'jshint', 'concurrent']);

    //Test task.
    grunt.registerTask('test', ['env:test', 'mochaTest']);
    grunt.registerTask('test:back', ['env:test', 'mochaTest']);


    // Maybe use connect as server when test frontend
    // grunt.registerTask('test:front', ['connect:testserver','karma:unit','karma:midway', 'karma:e2e']);
    // grunt.registerTask('test:unit', ['karma:unit']);
    // grunt.registerTask('test:midway', ['connect:testserver','karma:midway']);
    // grunt.registerTask('test:e2e', ['connect:testserver', 'karma:e2e']);
};

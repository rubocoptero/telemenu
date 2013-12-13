module.exports = function(grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        paths: {
            frontend: 'public',
            backend: 'app',
            dist: 'dist',
            test: 'test',
            frontendTest: 'test/public',
            backendTest: 'test/app'
        },
        watch: {
            backend: {
                files: [
                    '<%= paths.backendTest %>/**/*.js',
                    '<%= paths.backend %>/**/*.js'
                ],
                tasks: ['jshint:backend', 'test:backend']
            },
            jade: {
                files: ['<%= paths.backend %>/views/**'],
                options: {
                    livereload: true,
                },
            },
            frontend: {
                files: [
                    '<%= paths.frontend %>/js/**',
                    '<%= paths.frontendTest %>/js/**/*.js'
                ],
                tasks: ['jshint:frontend'],
                options: {
                    livereload: true,
                },
            },
            html: {
                files: ['<%= paths.frontend %>/views/**'],
                options: {
                    livereload: true,
                },
            },
            compass: {
                files: ['<%= paths.frontend %>/styles/sass/**/*.{scss, sass}'],
                tasks: ['compass:server'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            all: [
                'gruntfile.js',
                '<%= paths.frontend %>/js/**/*.js',
                '<%= paths.test %>/**/*.js',
                '<%= paths.backend %>/**/*.js'
            ],
            backend: [
                '<%= paths.backend %>/**/*.js',
                '<%= paths.backendTest %>/**/*.js'
            ],
            frontend: [
                '<%= paths.frontend %>/js/**/*.js',
                '<%= paths.frontendTest %>/js/**/*.js'
            ]
        },
        nodemon: {
            dev: {
                options: {
                    file: 'server.js',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['<%= paths.backend %>', 'config'],
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
            server: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        karma: {
            unit: {
                configFile: '<%= paths.frontendTest %>/karma-unit.conf.js',
                autoWatch: false,
                singleRun: true
            },
            unit_auto: {
                configFile: '<%= paths.frontendTest %>/karma-unit.conf.js'
            },
            midway: {
                configFile: '<%= paths.frontendTest %>/karma-midway.conf.js',
                autoWatch: false,
                singleRun: true
            },
            midway_auto: {
                configFile: '<%= paths.frontendTest %>/karma-midway.conf.js'
            },
            e2e: {
                configFile: '<%= paths.frontendTest %>/karma-e2e.conf.js',
                autoWatch: false,
                singleRun: true
            },
            e2e_auto: {
                configFile: '<%= paths.frontendTest %>/karma-e2e.conf.js'
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec',
                require: [
                    '<%= paths.backendTest %>/common.js'
                ]
            },
            src: ['<%= paths.backendTest %>/**/*.js']
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        compass: {
            options: {
                sassDir: '<%= paths.frontend %>/styles/sass',
                cssDir: '<%= paths.frontend %>/styles/css',
                importPath: '<%= paths.frontend %>/lib'
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
    grunt.registerTask('default', ['compass', 'jshint:all', 'concurrent:server']);

    //Test task.
    grunt.registerTask('test', ['env:test', 'mochaTest']);
    grunt.registerTask('test:backend', ['env:test', 'mochaTest']);
    grunt.registerTask('test:watch', [
        'env:test',
        'mochaTest',
        'watch:backend'
    ]);


    // Maybe use connect as server when test frontendend
    // grunt.registerTask('test:frontend', ['connect:testserver','karma:unit','karma:midway', 'karma:e2e']);
    // grunt.registerTask('test:unit', ['karma:unit']);
    // grunt.registerTask('test:midway', ['connect:testserver','karma:midway']);
    // grunt.registerTask('test:e2e', ['connect:testserver', 'karma:e2e']);
};

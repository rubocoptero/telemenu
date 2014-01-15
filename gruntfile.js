module.exports = function(grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        paths: {
            client: 'public',
            server: 'app',
            dist: 'dist',
            test: 'test',
            clientTests: 'test/client',
            serverTests: 'test/server'
        },
        watch: {
            server: {
                files: [
                    '<%= paths.serverTests %>/unit/**/*.js',
                    '<%= paths.server %>/**/*.js'
                ],
                tasks: ['jshint:server', 'test:server:unit']
            },
            jade: {
                files: ['<%= paths.server %>/views/**'],
                options: {
                    livereload: true,
                },
            },
            client: {
                files: [
                    '<%= paths.client %>/js/**',
                    '<%= paths.clientTests %>/js/**/*.js'
                ],
                tasks: ['jshint:client'],
                options: {
                    livereload: true,
                },
            },
            html: {
                files: ['<%= paths.client %>/views/**'],
                options: {
                    livereload: true,
                },
            },
            compass: {
                files: ['<%= paths.client %>/styles/sass/**/*.{scss, sass}'],
                tasks: ['compass:server'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            options: {
                expr: true
            },
            all: [
                'gruntfile.js',
                '<%= paths.client %>/js/**/*.js',
                '<%= paths.test %>/**/*.js',
                '<%= paths.server %>/**/*.js'
            ],
            server: [
                '<%= paths.server %>/**/*.js',
                '<%= paths.serverTests %>/**/*.js'
            ],
            client: [
                '<%= paths.client %>/js/**/*.js',
                '<%= paths.clientTests %>/js/**/*.js'
            ]
        },
        nodemon: {
            dev: {
                options: {
                    file: 'server.js',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['<%= paths.server %>', 'config'],
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
                configFile: '<%= paths.clientTests %>/karma-unit.conf.js',
                autoWatch: false,
                singleRun: true
            },
            unit_auto: {
                configFile: '<%= paths.clientTests %>/karma-unit.conf.js'
            },
            midway: {
                configFile: '<%= paths.clientTests %>/karma-midway.conf.js',
                autoWatch: false,
                singleRun: true
            },
            midway_auto: {
                configFile: '<%= paths.clientTests %>/karma-midway.conf.js'
            },
            e2e: {
                configFile: '<%= paths.clientTests %>/karma-e2e.conf.js',
                autoWatch: false,
                singleRun: true
            },
            e2e_auto: {
                configFile: '<%= paths.clientTests %>/karma-e2e.conf.js'
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec',
                require: [
                    '<%= paths.serverTests %>/common.js'
                ]
            },
            unit: ['<%= paths.serverTests %>/unit/**/*.js'],
            api: ['<%= paths.serverTests %>/api/**/*.js']
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        compass: {
            options: {
                sassDir: '<%= paths.client %>/styles/sass',
                cssDir: '<%= paths.client %>/styles/css',
                importPath: '<%= paths.client %>/lib'
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
    grunt.registerTask('test', ['env:test', 'mochaTest:unit', 'mochaTest:api']);
    grunt.registerTask('test:server:unit', ['env:test', 'mochaTest:unit']);
    grunt.registerTask('test:server:api', ['env:test', 'mochaTest:api']);
    grunt.registerTask('test:watch', [
        'env:test',
        'mochaTest:unit',
        'watch:server'
    ]);


    // Maybe use connect as server when test clientend
    // grunt.registerTask('test:client', ['connect:testserver','karma:unit','karma:midway', 'karma:e2e']);
    // grunt.registerTask('test:unit', ['karma:unit']);
    // grunt.registerTask('test:midway', ['connect:testserver','karma:midway']);
    // grunt.registerTask('test:e2e', ['connect:testserver', 'karma:e2e']);
};

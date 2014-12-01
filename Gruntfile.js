module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cfg: grunt.file.readJSON('config.json'),
        uglify: {
            mwapp: {
                options: {
                    beautify: true,
                    mangle: false
                },
                src: [
                    'assets/javascripts/app/app.js',
                    'assets/javascripts/app/app-local.js',
                    'assets/javascripts/app/utils.js',
                    'assets/javascripts/app/i18n.js',
                    'assets/javascripts/app/model.js',
                    'assets/javascripts/app/models/*.js',
                    'assets/javascripts/app/view.js',
                    'assets/javascripts/app/router.js',
                    'assets/javascripts/app/event.js',
                    'assets/javascripts/app/views/*.js',
                ],
                dest: '<%= cfg.path.dest %>/assets/javascripts/mw-app.js'
            },
            plugins: {
                src: [
                    'assets/javascripts/plugin/helper.js',
                    'assets/javascripts/plugin/plugins.js',
                    'assets/javascripts/plugin/qrcode.js',
                    'assets/javascripts/plugin/jquery.qrcode.js',
                    'assets/javascripts/plugin/fastclick.js',
                    'assets/javascripts/plugin/moment.js',
                    'assets/javascripts/plugin/moment.zh-cn.js',
                    'assets/javascripts/plugin/iscroll.js',
                    'assets/javascripts/plugin/mobiscroll.core.js',
                    'assets/javascripts/plugin/mobiscroll.datetime.js',
                    'assets/javascripts/plugin/mobiscroll.scroller.js',
                    'assets/javascripts/plugin/mobiscroll.i18n.zh.js',
                    'assets/javascripts/plugin/mobiscroll.scroller.android-ics.js'
                ],
                dest: '<%= cfg.path.dest %>/assets/javascripts/plugins.js'
            }
        },
        sass: {
            bootstrap: {
                options: { style: 'compressed', sourcemap: 'none' },
                src: 'assets/scss/bootstrap.scss',
                dest: '<%= cfg.path.dest %>/assets/stylesheets/bootstrap.css'
            },
            fontawesome: {
                options: { style: 'compressed', sourcemap: 'none' },
                src: 'assets/scss/font-awesome.scss',
                dest: '<%= cfg.path.dest %>/assets/stylesheets/font-awesome.css'
            },
            mobile: {
                options: { style: 'compressed', sourcemap: 'none' },
                src: 'assets/scss/mobile.scss',
                dest: '<%= cfg.path.dest %>/assets/stylesheets/mobile.css'
            }
        },
        includes: {
            files: {
                src: ['mobile/index.html'],
                dest: '<%= cfg.path.dest %>',
                flatten: true,
                cwd: '.'
            }
        },
        templates: {
            all: {
                src: ['assets/template/*.html', 'assets/template/*/*.html'],
                dest: '<%= cfg.path.dest %>/assets/javascripts/templates.js'
            }
        },
        copy: {
            staticfiles: {
                expand: true,
                src: [
                    'assets/stylesheets/**/*',
                    'assets/images/**/*',
                    'assets/fonts/**/*',
                    'assets/javascripts/vendor/**/*',
                    'assets/javascripts/boost.js',
                    'assets/javascripts/patch.js',
                    '.htaccess',
                    'cordova.js'
                ],
                dest: '<%= cfg.path.dest %>'
            }
        },
        watch: {
            scripts_mwapp: {
                files: ['assets/javascripts/app/**/*.js'],
                tasks: ['uglify:mwapp']
            },
            scripts_plugins: {
                files: ['assets/javascripts/plugin/*.js'],
                tasks: ['uglify:plugins']
            },
            staticfiles: {
                files: ['assets/stylesheets/**/*',
                        'assets/images/**/*',
                        'assets/fonts/**/*',
                        'assets/javascripts/vendor/**/*',
                        'assets/javascripts/boost.js',
                        'config.xml', '.htaccess', 'cordova.js'],
                tasks: ['copy']
            },
            sass_bootstrap: {
                files: [
                    'assets/scss/bootstrap/**/*.scss',
                    'assets/scss/_variables.scss',
                    'assets/scss/_bootstrap.scss',
                    'assets/scss/bootstrap.scss'
                ],
                tasks: ['sass:bootstrap']
            },
            sass_fontawesome: {
                files: [
                    'assets/scss/font-awesome/**/*.scss',
                    'assets/scss/font-awesome.scss'
                ],
                tasks: ['sass:fontawesome']
            },
            sass_mobile: {
                files: ['assets/scss/mobile/**/*.scss',
                        'assets/scss/pages/**/*.scss',
                        'assets/scss/_variables.scss',
                        'assets/scss/mobile.scss'],
                tasks: ['sass:mobile']
            },
            templates: {
                files: ['assets/template/**/*.html'],
                tasks: ['templates']
            },
            html: {
                files: ['mobile/*.html'],
                tasks: ['includes']
            }
        },
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: '<%= cfg.path.dest %>',
                    keepalive: true,
                    hostname: '*'
                }
            }
        },
        concurrent: {
            server: {
                tasks: ['watch', 'connect'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });
    
    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-shell');
    
    // Configurable port number
    var port = grunt.option('port');
    if (port) grunt.config('connect.server.options.port', port);
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('server', 'concurrent:server');
    grunt.registerTask('dist', ['sass', 'includes', 'templates', 'uglify', 'copy']);
};

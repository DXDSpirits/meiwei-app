module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cfg: grunt.file.readJSON('config.json'),
        concat: {
            mwapp: {
                src: [
                    'assets/javascripts/app/_open.js',
                    'assets/javascripts/app/app.js',
                    'assets/javascripts/app/app-local.js',
                    'assets/javascripts/app/utils.js',
                    'assets/javascripts/app/i18n.js',
                    'assets/javascripts/app/model.js',
                    'assets/javascripts/app/models/*.js',
                    'assets/javascripts/app/view.js',
                    'assets/javascripts/app/router.js',
                    'assets/javascripts/app/event.js',
                    'assets/javascripts/app/_close.js',
                    'assets/javascripts/app/views/*.js',
                ],
                dest: '<%= cfg.path.dest %>/assets/javascripts/mw-app.js'
            }
        },
        uglify: {
            mwapp: {
                src: '<%= cfg.path.dest %>/assets/javascripts/mw-app.js',
                dest: '<%= cfg.path.dest %>/assets/javascripts/mw-app.min.js'
            },
            bootstrap: {
                src: 'assets/javascripts/bootstrap.js',
                dest: '<%= cfg.path.dest %>/assets/javascripts/bootstrap.js'
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
            mobile: {
                options: { style: 'compressed' },
                src: 'assets/scss/mobile.scss',
                dest: '<%= cfg.path.dest %>/assets/css/mobile.min.css'
            },
            development: {
                src: 'assets/scss/mobile.scss',
                dest: '<%= cfg.path.dest %>/assets/css/mobile.css'
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
                    'assets/css/**/*',
                    'assets/images/**/*',
                    'assets/font/**/*',
                    'assets/javascripts/vendor/**/*',
                    '.htaccess',
                    'cordova.js'
                ],
                dest: '<%= cfg.path.dest %>'
            }
        },
        watch: {
            scripts_mwapp: {
                files: ['assets/javascripts/app/*.js', 'assets/javascripts/app/models/*.js', 'assets/javascripts/app/views/*.js'],
                tasks: ['concat:mwapp', 'uglify:mwapp']
            },
            scripts_bootstrap: {
                files: ['assets/javascripts/bootstrap.js'],
                tasks: ['uglify:bootstrap']
            },
            scripts_plugins: {
                files: ['assets/javascripts/plugin/*.js'],
                tasks: ['uglify:plugins']
            },
            staticfiles: {
                files: ['assets/css/**/*', 'assets/images/**/*', 'assets/font/**/*', 'assets/javascripts/vendor/**/*', 
                        'config.xml', '.htaccess', 'cordova.js'],
                tasks: ['copy']
            },
            stylesheets: {
                files: ['assets/scss/*.scss', 'assets/scss/mobile/*.scss', 'assets/scss/font-awesome/*.scss', 'assets/scss/pages/*.scss'],
                tasks: ['sass']
            },
            templates: {
                files: ['assets/template/*.html', 'assets/template/*/*.html'],
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
            dist: {
                tasks: ['concat', 'sass', 'includes', 'templates', 'uglify', 'copy'],
                options: { logConcurrentOutput: true }
            },
            server: {
                tasks: ['watch', 'connect'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });
    
    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-concat');
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
    grunt.registerTask('dist', 'concurrent:dist');
};

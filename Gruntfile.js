module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		cfg: grunt.file.readJSON('config.json'),
		concat: {
		    mwapp: {
                src: [
                    'assets/js/app/_open.js',
                    'assets/js/app/app.js',
                    'assets/js/app/app-local.js',
                    'assets/js/app/utils.js',
                    'assets/js/app/i18n.js',
                    'assets/js/app/model.js',
                    'assets/js/app/models/*.js',
                    'assets/js/app/view.js',
                    'assets/js/app/router.js',
                    'assets/js/app/bootstrap.js',
                    'assets/js/app/_close.js',
                    'assets/js/app/views/*.js',
                ],
                dest: 'assets/js/mw-app.js'
            }
		},
		uglify: {
			mwapp: {
				/*options: {
					sourceMap: '<%= cfg.path.dest %>/assets/js/mw-app.min.map',
					sourceMappingURL: 'mw-app.min.map',
					sourceMapPrefix: 2,
					mangle: false,
					beautify: {
						width: 80,
						beautify: true
					}
				},*/
				src: 'assets/js/mw-app.js',
				dest: '<%= cfg.path.dest %>/assets/js/mw-app.min.js'
			},
			plugins: {
				files: [
					{
						src: 'assets/js/plugin/helper.js',
						dest: '<%= cfg.path.dest %>/assets/js/plugin/helper.min.js'
					},{
						src: 'assets/js/plugin/plugins.js',
						dest: '<%= cfg.path.dest %>/assets/js/plugin/plugins.min.js'
					},{
						src: ['assets/js/plugin/qrcode.js', 'assets/js/plugin/jquery.qrcode.js'],
						dest: '<%= cfg.path.dest %>/assets/js/plugin/qrcode.min.js'
					},{
						src: 'assets/js/plugin/iscroll.js',
						dest: '<%= cfg.path.dest %>/assets/js/plugin/iscroll.min.js'
					}
				]
			}
		},
		sass: {
			mobile: {
				options: { style: 'compressed' },
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
				dest: '<%= cfg.path.dest %>/assets/js/templates.js'
			}
		},
		copy: {
			staticfiles: {
				expand: true,
    			src: ['assets/img/**/*', 'assets/font/**/*', 'assets/js/vendor/**/*', 'config.xml'],
    			dest: '<%= cfg.path.dest %>'
			}
		},
		watch: {
			scripts_mwapp: {
				files: ['assets/js/app/*.js', 'assets/js/app/models/*.js', 'assets/js/app/views/*.js'],
				tasks: ['concat:mwapp', 'uglify:mwapp']
			},
			scripts_plugins: {
				files: ['assets/js/plugin/*.js'],
				tasks: ['uglify:plugins']
			},
			staticfiles: {
				files: ['assets/img/**/*', 'assets/font/**/*', 'assets/js/vendor/**/*', 'config.xml'],
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
					hostname: null,
					middleware: function(connect, options){
						var appcache = grunt.option('appcache');
						return [
							function(req, res, next){
								if (req.url == '/manifest.appcache' && !appcache){
									res.writeHead(404);
									res.end();
								} else {
									next();
								}
							},
							connect.static(options.base),
							connect.directory(options.base)
						];
					}
				}
			}
		},
		concurrent: {
		    dist: {
                tasks: ['sass', 'includes', 'templates', 'concat', 'uglify', 'copy'],
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
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-includes');
	grunt.loadNpmTasks('grunt-gettext');
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

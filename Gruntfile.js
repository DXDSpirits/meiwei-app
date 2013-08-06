module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			mwapp: {
				options: {
					sourceMap: 'assets/js/mw-app.map',
					beautify: {
						width: 80,
						beautify: true
					}
				},
				files: {
					'assets/js/mw-app.js': [
						'assets/js/app/app.js',
						'assets/js/app/app-local.js',
						'assets/js/app/templates.js',
						'assets/js/app/model.js',
						'assets/js/app/models/*.js',
						'assets/js/app/view.js',
						'assets/js/app/views/*.js',
						'assets/js/app/router.js',
						'assets/js/app/bootstrap.js'
					]
				}
			}
		},
		sass: {
			dist: {
				files: {
					'assets/css/mobile.css': 'assets/scss/mobile.scss'
				}
			}
		},
		includes: {
			files: {
				src: ['mobile/index.html'],
				dest: '.',
				flatten: true,
				cwd: '.'
			}
		},
		templates: {
			all: {
				files: {
					'assets/js/app/templates.js': [
						'assets/template/*.html',
						'assets/template/*/*.html'
					]
				}
			}
		},
		jshint: {
			all: [
				'assets/js/app/*.js'
			]
		},
		watch: {
			scripts: {
				files: [
					'assets/js/app/*.js',
					'assets/js/app/models/*.js',
					'assets/js/app/views/*.js'
				],
				tasks: ['uglify']
			},
			stylesheets: {
				files: [
					'assets/scss/*.scss',
					'assets/scss/mobile/*.scss',
					'assets/scss/font-awesome/*.scss',
					'assets/scss/pages/*.scss'
				],
				tasks: ['sass']
			},
			templates: {
				files: [
					'assets/template/*.html',
					'assets/template/*/*.html'
				],
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
			server: {
				tasks: ['watch', 'connect'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-includes');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-concurrent');

	// Configurable port number
	var port = grunt.option('port');
	if (port) grunt.config('connect.server.options.port', port);
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.registerTask('server', 'concurrent:server');

};

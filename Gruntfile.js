module.exports = function(grunt) {
	var _ = grunt.util._;
	var locales = ["zh-CN"];
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			mwapp: {
				options: {
					sourceMap: 'assets/js/mw-app.map',
					sourceMappingURL: 'mw-app.map',
					sourceMapPrefix: 2,
					mangle: false,
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
			},
			iscroll: {
				options: {
					sourceMap: 'assets/js/plugin/iscroll/iscroll-min.map',
					sourceMappingURL: 'iscroll-min.map',
					sourceMapPrefix: 4,
				},
				files: {
					'assets/js/plugin/iscroll/iscroll-min.js': [
						'assets/js/plugin/iscroll/iscroll.js'
					]
				}
			},
			i18n: {
				options: {
					sourceMap: 'assets/js/plugin/i18n/i18n-min.map',
					sourceMappingURL: 'i18n-min.map',
					sourceMapPrefix: 4,
				},
				files: {
					'assets/js/plugin/i18n/i18n-min.js': [
						'assets/js/plugin/i18n/icu.js',
						'assets/js/plugin/i18n/translate.js'
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
		xgettext : {
			options : {
				functionName : "_i",
				potFile : "locale/messages.pot",
				//processMessage: function(message) { ... }
			},
			target : {
				files : {
					handlebars : [],
					javascript : ['assets/js/mw-app.js']
				}
			}
		},
		po2json: {
			target: { 
				files: _.object(
					_.map(locales, function(locale) { return "locale/" + locale + ".js"; }),
					_.map(locales, function(locale) { return "locale/" + locale + ".po"; })
				)
			}, 
			options: { requireJs: true }
		},
		watch: {
			scripts_mwapp: {
				files: ['assets/js/app/*.js', 'assets/js/app/models/*.js', 'assets/js/app/views/*.js'],
				tasks: ['uglify:mwapp']
			},
			scripts_iscroll: {
				files: ['assets/js/plugin/iscroll/iscroll.js'],
				tasks: ['uglify:iscroll']
			},
			scripts_i18n: {
				files: ['assets/js/plugin/i18n/icu.js', 'assets/js/plugin/i18n/translate.js'],
				tasks: ['uglify:i18n']
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
		},
		shell: {
			options: {
				failOnError: true,
				stdout: true
			},
			msgmerge: {
				command: _.map(locales, function(locale) {
					var po = "locale/" + locale + ".po";
					return "if [ -f \"" + po + "\" ]; then\n" +
						   "    echo \"Updating " + po + "\"\n" +
						   "    msgmerge " + po + " locale/messages.pot > .new.po.tmp\n" +
						   "    if [ $? -ne 0 ]; then\n" +
						   "        echo \"Msgmerge failed with exit code $?\"\n" +
						   "        exit $?\n" +
						   "    fi\n" +
						   "    mv .new.po.tmp " + po + "\n" +
						   "fi\n";
				}).join("")
			}
		}
	});
	
	grunt.loadTasks('tasks');
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

};

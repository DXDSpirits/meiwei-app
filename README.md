Meiwei Cordova App
==================

Development stuff
-----------------

- Prerequisites

		git clone git@bitbucket.org:DXDSpirits/meiwei-app.git
		cd meiwei-app/
		npm install

- [Grunt](http://gruntjs.com/) tasks

	- Compile templates in `assets/template/*` to generate `assets/js/app/templates.js`

			grunt templates

	- Concat and minify JavaScript files in `assets/js/app/*` to generate `assets/js/mw-app.js`

			grunt uglify

	- Compile Sass files in `assets/sass/*` to generate `assets/css/mobile.css`

			grunt sass

	- Concat html files in `mobile/*` to generate `index.html`

			grunt includes

	- Watch the templates and scripts, run `templates`, `uglify`, `sass` and `includes` tasks when they're changed

			grunt watch

	- Run a local dev server.

			grunt connect

		Arguments:

		- `--appcache` - enable Application Cache
		- `--port=XX` - specify a custom port number

	- Run both `watch` and `connect` tasks at the same time

			grunt server 

License
-------

Licensed under the [MIT License](http://xd.mit-license.org/).

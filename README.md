Meiwei Web App / Cordova App
==================



Development stuff
-----------------

- Prerequisites

	- Install nodejs and git

	- Install Grunt's command line interface

			npm install -g grunt-cli

	- Prepare Project

			git clone git@github.com:DXDSpirits/meiwei-app.git
			cd meiwei-app
			npm install

- [Grunt](http://gruntjs.com/) tasks

	- Config distribute path

			echo {"path": {"dest": "www","src": "."}} >> config.json

	- Compile templates in `assets/template/*` to generate `www/assets/js/templates.js`

			grunt templates

	- Concat JavaScript files in `assets/js/app/*` to generate `assets/js/mw-app.js`

			grunt concat

	- Minify JavaScript files in `assets/js/plugin/*` and `assets/js/mw-app.js` to generate `www/assets/js/plugin/*` and `assets/js/mw-app.js`

			grunt uglify

	- Compile Sass files in `assets/sass/*` to generate `www/assets/css/mobile.css`

			grunt sass

	- Concat html files in `mobile/*` to generate `www/index.html`

			grunt includes

	- Copy images, fonts, vendor scripts and other static files to `www`

			grunt copy

	- Alternative to previous 6 commandes, eg. run templates + concat + uglify + sass + includes + copy at the same time

			grunt dist

	- Monitor files, run tasks when they're changed

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

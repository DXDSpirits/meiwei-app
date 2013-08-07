
MeiweiApp.Collection = Backbone.Collection.extend({
	parse: function(response) {
		if (response.results != null) {
			this.count = response.count;
			this.previous = response.previous;
			this.next = response.next;
			return response.results;
		} else {
			return response;
		}
	},
	fetchNext: function(options) {
		var options = options || {};
		if (this.next) {
			options.url = this.next;
			this.fetch(options);
		}
	},
	fetchPrev: function(options) {
		var options = options || {};
		if (this.previous) {
			options.url = this.previous;
			this.fetch(options);
		}
	},
	fetch: function(options) {
		options = options || {};
		options.timeout = options.timeout || MeiweiApp.configs.timeout;
		var key = options.url || this.url;
		var error = options.error;
		options.error = function(collection, response, options) {
			if (key) {
				var localResp = localStorage.getItem(key);
				if (localResp && options.success) return options.success(JSON.parse(localResp));
			}
			if (error) error(collection, response, options);
		};
		var success = options.success;
		options.success = function(collection, response, options) {
			if (key) localStorage.setItem(key, JSON.stringify(collection.toJSON()));
			if (success) success(collection, response, options);
		};
		return Backbone.Collection.prototype.fetch.call(this, options);
	},
});

MeiweiApp.Model = Backbone.Model.extend({
	fetch: function(options) {
		options = options || {};
		options.timeout = options.timeout || MeiweiApp.configs.timeout;
		var key = options.url || (this.urlRoot ? this.url(): null);
		var error = options.error;
		options.error = function(model, response, options) {
			if (key) {
				var localResp = localStorage.getItem(key);
				if (localResp && options.success) return options.success(JSON.parse(localResp));
			}
			if (error) error(model, response, options);
		};
		var success = options.success;
		options.success = function(model, response, options) {
			if (key) localStorage.setItem(key, JSON.stringify(model.toJSON()));
			if (success) success(model, response, options);
		};
		return Backbone.Model.prototype.fetch.call(this, options);
	},
	url: function() {
		if (this.attributes.url) {
			return this.attributes.url;
		} else {
			var origUrl = Backbone.Model.prototype.url.call(this);
			return origUrl + (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
		}
	}
});

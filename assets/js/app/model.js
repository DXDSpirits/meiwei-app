
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
	}
});

MeiweiApp.Model = Backbone.Model.extend({
	fetch: function(options) {
		var originalFetch = Backbone.Model.prototype.fetch;
		options = options || {};
		options.timeout = options.timeout || MeiweiApp.configs.timeout;
		var thisCollection = this;
		var error = options.error;
		options.error = function(collection, response, options) {
			if (error) error(collection, response, options);
		};
		var success = options.success;
		options.success = function(collection, response, options) {
			if (thisCollection.name) {
				localStorage.setItem(thisCollection.name, JSON.stringify(collection.toJSON()));
			}
			if (success) success(collection, response, options);
		};
		return originalFetch.call(this, options);
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

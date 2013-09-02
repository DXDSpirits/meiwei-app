
MeiweiApp.getCurrentTime = function() {
	return new Date() - new Date(0);
}

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
		var key = options.url || this.url;
		if (key) {
			if (options.data) key += ' ' + JSON.stringify(options.data);
			var localResp = localStorage.getItem(key);
			if (localResp) {
				try {
					var localJSON = JSON.parse(localResp);
					if (MeiweiApp.getCurrentTime() - (localJSON.time || 0) < 5 * 60 * 1000) {
						var method = options.reset ? 'reset' : 'set';
						aaa = this;
						bbb = localJSON;
				        this[method](this.parse(localJSON.collection, options), options);
						if (options.success) options.success(this, localJSON.collection, options);
						this.trigger('sync', this, localJSON.collection, options);
						return;
					}
					var error = options.error;
					options.error = function(collection, response, options) {
						if (options.success) return options.success(localJSON.collection);
						if (error) error(collection, response, options);
					};
				} catch (e) {
					MeiweiApp.handleError(e);
				}
			}
			var success = options.success;
			options.success = function(collection, response, options) {
				var json = {collection: response, time: MeiweiApp.getCurrentTime()};
				localStorage.setItem(key, JSON.stringify(json));
				if (success) success(collection, response, options);
			};
		}
		return Backbone.Collection.prototype.fetch.call(this, options);
	},
});

MeiweiApp.Model = Backbone.Model.extend({
	fetch: function(options) {
		options = options || {};
		var key = options.url || (this.urlRoot ? this.url(): null);
		if (key) {
			if (options.data) key += ' ' + JSON.stringify(options.data);
			var localResp = localStorage.getItem(key);
			if (localResp) {
				try {
					var localJSON = JSON.parse(localResp);
					if (MeiweiApp.getCurrentTime() - (localJSON.time || 0) < 5 * 60 * 1000) {
						if (!this.set(this.parse(localJSON.model, options), options)) return false;
						if (options.success) options.success(this, localJSON.model, options);
						this.trigger('sync', this, localJSON.model, options);
						return;
					}
					var error = options.error;
					options.error = function(model, response, options) {
						if (options.success) return options.success(localJSON.model);
						if (error) error(model, response, options);
					};
				} catch (e) {
					MeiweiApp.handleError(e);
				}
			}
			var success = options.success;
			options.success = function(model, response, options) {
				var json = {model: response, time: MeiweiApp.getCurrentTime()};
				localStorage.setItem(key, JSON.stringify(json));
				if (success) success(model, response, options);
			};
		}
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

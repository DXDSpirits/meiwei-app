
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
	url: function() {
		if (this.attributes.url) {
			return this.attributes.url;
		} else {
			var origUrl = Backbone.Model.prototype.url.call(this);
        	return origUrl + (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
		}
	}
});

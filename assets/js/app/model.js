
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
	fetchNext: function() {
		if (this.next) {
			this.url = this.next;
			this.fetch({reset: true});
		}
	},
	fetchPrev: function() {
		if (this.previous) {
			this.url = this.previous;
			this.fetch({reset: true});
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

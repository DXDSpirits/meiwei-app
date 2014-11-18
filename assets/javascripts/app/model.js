(function() {
    
    MeiweiApp.initCache = function(model, options) {
    	var key = options.url || (_.isFunction(model.url) ? model.url(): model.url);
    	var localResp = localStorage.getItem(key);
    	if (localResp) {
    		var error = options.error;
    		options.error = function(model, response, options) {
    			if (options.success) return options.success(JSON.parse(localResp));
    			if (error) error(model, response, options);
    		};
    	}
    	var success = options.success;
    	options.success = function(model, response, options) {
    		localStorage.setItem(key, JSON.stringify(response));
    		if (success) success(model, response, options);
    	};
    };
    
    MeiweiApp.Model = Backbone.Model.extend({
        fetch: function(options) {
            options = options || {};
            //MeiweiApp.initCache(this, options);
            var self = this;
            _.delay(function() {
                Backbone.Model.prototype.fetch.call(self, options);
            }, options.delay || 0);
        },
        url: function() {
            if (this.attributes.url) {
                return this.attributes.url;
            } else {
                var origUrl = Backbone.Model.prototype.url.call(this);
                return origUrl + (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
            }
        },
    });
    
    MeiweiApp.Collection = Backbone.Collection.extend({
        model: MeiweiApp.Model,
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
    	smartSet: function(models, options) {
    		this[this.isEmpty() ? 'reset' : 'set'](models, options);
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
    		options.reset = options.reset || this.isEmpty();
    		//MeiweiApp.initCache(this, options);
    		var self = this;
            _.delay(function() {
               Backbone.Collection.prototype.fetch.call(self, options); 
            }, options.delay || 0);
    	},
    });

})();


var MeiweiApp = new (Backbone.View.extend({
	
	Models: {},
	Views: {},
	Collections: {},
	
	Templates: {},
	Pages: {},
	
	configs: {
		
	},
	
	events: {
		
	},

    log: function(msg) { console.log(msg) },
    
	start: function() {
		Backbone.history.start();
	}
}))({el: document.body});

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

MeiweiApp.View = Backbone.View.extend({});

MeiweiApp.ModelView = Backbone.View.extend({
	initialize: function() {
		this.model.on('change', this.render, this);
	},
	template: Mustache.compile(""),
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

MeiweiApp.CollectionView = Backbone.View.extend({
	modelView: MeiweiApp.ModelView,
	initialize: function() {
		this.collection.on('reset', this.addAll, this);
		this.collection.on('add', this.addOne, this);
	},
	addOne: function(item) {
		this.$el.append((new this.modelView({model: item})).render().el);
	},
	addAll: function() {
		this.$el.html("");
		this.collection.forEach(this.addOne, this);
	},
	render: function() {
	    this.addAll();
	    return this;
	}
});

MeiweiApp.PageView = Backbone.View.extend({
	slideIn: function() {
		if (this.$el && this.$el.hasClass('view-hidden')) {
			$('.view').addClass('view-hidden');
			this.$el.removeClass('view-hidden');
		}
	},
	show: function() {
		this.render();
		this.slideIn();
	}
});

$(function(){
	MeiweiApp.start();
});

/*'click a[data-router]': function(e) {
	e.preventDefault();
	Backbone.history.navigate(e.target.pathname, {trigger: true});
},*/
/*'touchstart .view>.wrapper': function(e) {
	document.body.style.height = '600px';
	setTimeout( function(){ window.scrollTo(0, 0); }, 0 );
}*/

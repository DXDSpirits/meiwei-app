
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
	ModelView: MeiweiApp.ModelView,
	initialize: function() {
		this.modelViews = [];
		this.collection.on('reset', this.addAll, this);
		this.collection.on('add', this.addOne, this);
	},
	addOne: function(item) {
		var modelView = new this.ModelView({model: item});
		this.modelViews.push(modelView);
		this.$el.append(modelView.render().el);
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
	events: {
		'click header .back-btn': function() { window.history.back(); }
	},
	
	initialize: function() {
		if (this.initPage != null) {
			this.initPage();
		}
	},
	initScroller: function() {
		if (this.scroller == null) {
		    this.scroller = new IScroll(this.$('.scroll').selector);
		} else {
			this.scroller.refresh();
		}
	},
	
	show: function() {
		this._startShow();
		this.render.apply(this, arguments); // Pass arguments to render function;
		this._endShow();
	},
	_startShow: function() {
		$("#apploader").removeClass('hide');
	},
	_endShow: function() {
		var self = this;
		$(document).ajaxStop(function() {
			$("#apploader").addClass('hide');
			if (self.$el && self.$el.hasClass('view-hidden')) {
				$('.view').addClass('view-hidden');
				self.$el.removeClass('view-hidden');
			}
			//self.initScroller();
		});
	}
});

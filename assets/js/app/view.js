
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
	modelViews: [],
	initialize: function() {
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
	views: {},
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

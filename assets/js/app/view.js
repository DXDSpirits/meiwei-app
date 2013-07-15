
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
		'click header .header-btn-left': 'onClickLeftBtn',
		'click header .header-btn-right': 'onClickRightBtn'
	},
	
	initialize: function() {
		this.views = {};
		_.bindAll(this, 'initScroller', 'go', 'showPage')
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
	onClickLeftBtn: function() { window.history.back(); },
	onClickRightBtn: function() {},
	go: function() {
		$("#apploader").removeClass('hide');
		this.render.apply(this, arguments); // Pass arguments to render function;
	},
	showPage: function() {
		$("#apploader").addClass('hide');
		if (this.$el && this.$el.hasClass('view-hidden')) {
			var $curPage = $('.view:not(".view-hidden")');
			$curPage.addClass('view-hiding');
			setTimeout(function(){
				$curPage.removeClass('view-hiding');
				$curPage.addClass('view-hidden');
			}, 1000);
			this.$el.removeClass('view-hidden');
		}
		//this.initScroller();
	}
});

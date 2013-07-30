
MeiweiApp.View = Backbone.View.extend({});

MeiweiApp.ModelView = Backbone.View.extend({
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'hide', this.remove);
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
		this.listenTo(this.collection, 'reset', this.addAll);
		this.listenTo(this.collection, 'add', this.addOne);
		this.listenTo(this.collection, 'remove', this.removeOne);
	},
	removeOne: function(item) {
		item.trigger('hide');
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
	initialize: function() {
		this.views = {};
		_.bindAll(this, 'showPage', 'go', 'onClickLeftBtn', 'onClickRightBtn', 'initScroller');
		
		//These 2 lines should be after bindAll, in order to bind ClickBtn events propertly
		new MBP.fastButton(this.$('.header-btn-left')[0], this.onClickLeftBtn);
		new MBP.fastButton(this.$('.header-btn-right')[0], this.onClickRightBtn);
		
		if (this.initPage != null) {
			this.initPage();
		}
	},
	onClickLeftBtn: function() { MeiweiApp.goBack(); },
	onClickRightBtn: function() {},
	initScroller: function() {
		if (this.scroller == null) {
			if (this.$('.scroll').length > 0) {
			    this.scroller = new IScroll(this.$('.scroll').selector, {
			    	//click: true
			    	preventDefault: false
				});
			}
		} else {
			this.scroller.refresh();
		}
	},
	go: function(options) {
		$("#apploader").removeClass('hide');
		this.options = this.options || {};
		_.extend(this.options, options);
		this.render();
	},
	showPage: function() {
		window.scrollTo(0, 0);
		$("#apploader").addClass('hide');
		if (this.$el && this.$el.hasClass('view-hidden')) {
			var $curPage = $('.view:not(".view-hidden")');
			$curPage.addClass('view-hidden');
			this.$el.removeClass('view-hidden');
			this.initScroller();
		}
	}
});


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
		try {
			item.trigger('hide');
			for (var i=0; i<this.modelViews.length; i++) {
				if (this.modelViews[i].model.id == item.id) {
					this.modelViews.splice(i, 1);
					break;
				}
			}
		} catch (e) {
			MeiweiApp.handleError(e);
		}
	},
	addOne: function(item) {
		try {
			var modelView = new this.ModelView({model: item});
			this.modelViews.push(modelView);
			this.$el.append(modelView.render().el);
		} catch (e) {
			MeiweiApp.handleError(e);
		}
	},
	addAll: function() {
		try {
			for (var i=0; i<this.modelViews.length; i++) this.modelViews[i].remove();
			this.modelViews.length = 0;
			var $list = [];
			this.collection.forEach(function(item) {
				var modelView = new this.ModelView({model: item});
				this.modelViews.push(modelView);
				$list.push(modelView.render().el);
			}, this);
			this.$el.html($list);
		} catch (e) {
			MeiweiApp.handleError(e);
		}
	},
	render: function() {
	    this.addAll();
	    return this;
	}
});

MeiweiApp.PageView = Backbone.View.extend({
	initialize: function() {
		this.views = {};
		_.bindAll(this, 'showPage', 'go', 'render', 'reset', 'onClickLeftBtn', 'onClickRightBtn', 'initScroller');
		
		//These 2 lines should be after bindAll, in order to bind ClickBtn events propertly
		new MBP.fastButton(this.$('.header-btn-left')[0], this.onClickLeftBtn);
		new MBP.fastButton(this.$('.header-btn-right')[0], this.onClickRightBtn);
		
		var minHeight = this.$('.scroll').height() + 1;
		this.$('.scroll-inner').css('min-height', minHeight + 'px');
		
		if (this.initPage != null) {
			this.initPage();
		}
	},
	onClickLeftBtn: function() { MeiweiApp.goBack(); },
	onClickRightBtn: function() {},
	initScroller: function(options) {
		options = options || { preventDefault: false };
		if (this.scroller == null) {
			if (this.$('.iscroll').length > 0) {
			    this.scroller = new IScroll(this.$('.iscroll').selector, options);
			}
		} else {
			this.scroller.refresh();
		}
	},
	go: function(options) {
		this.options = options || {};
		this.reset();
		this.showPage();
		var render = this.render;
		setTimeout(function() {
			try {
				render();
			} catch (e) {
				MeiweiApp.handleError(e);
			}
		}, 500);
	},
	refresh: function() {
		this.showPage();
		var render = this.render;
		setTimeout(function() {
			try {
				render();
			} catch (e) {
				MeiweiApp.handleError(e);
			}
		}, 500);
	},
	reset: function() {},
	showPage: function() {
		window.scrollTo(0, 0);
		if (this.$el && this.$el.hasClass('view-hidden')) {
			var $curPage = $('.view:not(".view-hidden")');
			$curPage.addClass('view-hidden');
			this.$el.removeClass('view-hidden');
			this.initScroller();
		}
	}
});

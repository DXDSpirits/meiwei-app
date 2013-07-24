
MeiweiApp.View = Backbone.View.extend({});

MeiweiApp.ModelView = Backbone.View.extend({
	initialize: function() {
		this.model.on('change', this.render, this);
		this.model.on('hide', this.remove, this);
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
		this.collection.on('remove', this.removeOne, this);
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
		_.bindAll(this, 'initScroller', 'go', 'showPage', 'onClickLeftBtn', 'onClickRightBtn');
		
		new MBP.fastButton(this.$('.header-btn-left')[0], this.onClickLeftBtn);
		new MBP.fastButton(this.$('.header-btn-right')[0], this.onClickRightBtn);
		
		this.lastPage = null;
		
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
	//onClickLeftBtn: function() { window.history.back(); },
	onClickLeftBtn: function() { MeiweiApp.Pages.Home.showPage(); },
	onClickRightBtn: function() {},
	go: function() {
		$("#apploader").removeClass('hide');
		if (_.isEmpty(arguments)) {
			this.render({});
		} else {
			this.render(arguments[0]); // Pass arguments to render function;
		}
	},
	showPage: function() {
		$("#apploader").addClass('hide');
		if (this.$el && this.$el.hasClass('view-hidden')) {
			var $curPage = $('.view:not(".view-hidden")');
			$curPage.addClass('view-hidden');
			this.$el.removeClass('view-hidden');
		}
	}
});


/*var $me = this.$el;
$me.on('webkitAnimationEnd', function(e) {
	if (e.originalEvent.animationName == 'slideouttoleft') {
		$me.removeClass('view-hiding');
		$me.addClass('view-hidden');
	} else if (e.originalEvent.animationName == 'slideinfromright') {
		$me.removeClass('view-showing');
	}
});*/

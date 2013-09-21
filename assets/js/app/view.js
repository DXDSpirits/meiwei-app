
MeiweiApp.View = Backbone.View.extend({
	initialize: function() {
		this.addFastButtons();
		if (this.initView) this.initView();
	},
	bindFastButton: function(el, handler) {
		this.fastButtons = this.fastButtons || [];
		var btn = new MBP.fastButton(el.length && el.length >= 1 ? el[0] : el, handler);
		this.fastButtons.push(btn);
		return btn;
	},
	displayError: function($el, text) {
		try {
			var error = JSON.parse(text);
			for (var k in error) { $el.html(error[k]);  break; };
		} catch (e) {
			$el.html(text);
		}
	},
	addFastButtons: function() {
        var EVENT_NAME = 'fastclick';
        var events = (_.isFunction(this.events) ? this.events() : this.events) || {};
        var that = this;
        function byEventName(key) {
            return key.substr(0, EVENT_NAME.length + 1) === EVENT_NAME + ' ' || key === EVENT_NAME;
        }
        function toJustSelectors(key) {
            return key.substr(EVENT_NAME.length + 1);
        }
        function toMatchingElements(selector) {
            return selector === "" ? [that.el] : that.$(selector).toArray();
        }
        function registerTrigger(element) {
            new MBP.fastButton(element, function() {
                $(element).trigger(EVENT_NAME);
            });
        }
        _.chain(events).keys().filter(byEventName).map(toJustSelectors).map(toMatchingElements).flatten().each(registerTrigger);
    }
});

MeiweiApp.ModelView = MeiweiApp.View.extend({
	initView: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'hide', this.remove);
		if (this.initModelView) this.initModelView();
	},
	template: Mustache.compile(""),
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

MeiweiApp.CollectionView = MeiweiApp.View.extend({
	ModelView: MeiweiApp.ModelView,
	initView: function() {
		this.listenTo(this.collection, 'reset', this.addAll);
		this.listenTo(this.collection, 'add', this.addOne);
		this.listenTo(this.collection, 'remove', this.removeOne);
		if (this.initCollectionView) this.initCollectionView();
	},
	removeOne: function(item) {
		item.trigger('hide');
	},
	addOne: function(item) {
		try {
			var modelView = new this.ModelView({model: item});
			this.$el.append(modelView.render().el);
		} catch (e) {
			MeiweiApp.handleError(e);
		}
	},
	addAll: function() {
		try {
			var $list = [];
			this.collection.forEach(function(item) {
				var modelView = new this.ModelView({model: item});
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

MeiweiApp.PageView = MeiweiApp.View.extend({
	events: {
		'fastclick .header-btn-left': 'onClickLeftBtn',
		'fastclick .header-btn-right': 'onClickRightBtn'
	},
	initView: function() {
		this.views = {};
		_.bindAll(this, 'showPage', 'go', 'refresh', 'render', 'reset', 
						'onClickLeftBtn', 'onClickRightBtn', 'initScroller');
		this.$('.scroll-inner').css('min-height', (this.$('.scroll').height() + 1) + 'px');
		if (this.initPage) this.initPage();
	},
	onClickLeftBtn: function() { MeiweiApp.goBack(); },
	onClickRightBtn: function() {},
	initScroller: function() {
		if (this.scroller == null) {
			if (this.$('.iscroll').length > 0) {
			    this.scroller = new IScroll(this.$('.iscroll').selector, {
			    	tap: true, tagName: /^(INPUT|TEXTAREA|SELECT)$/
			    });
			}
		} else {
			this.scroller.refresh();
		}
	},
	initPageNav: function(page, collection) {
		page.fetchNext = function() {
			if (page.scroller) page.scroller.scrollTo(0, 0, 1000);
			setTimeout(function() {
				collection.fetchNext({success: function(collection, xhr, options) {
					page.resetNavigator(collection, xhr, options);
				}});
			}, 1000);
		};
		page.fetchPrev = function() {
			if (page.scroller) page.scroller.scrollTo(0, 0, 1000);
			setTimeout(function() {
				collection.fetchPrev({success: function(collection, xhr, options) {
					page.resetNavigator(collection, xhr, options);
				}});
			}, 1000);
		};
		page.resetNavigator = function() {
			page.$('.page-nav').toggleClass('hidden', (collection.next == null && collection.previous == null));
			page.$('.page-next').toggleClass('hidden', (collection.next == null));
			page.$('.page-prev').toggleClass('hidden', (collection.previous == null));
			if (page.scroller) page.initScroller();
		};
		page.bindFastButton(page.$('.page-prev'), page.fetchPrev);
		page.bindFastButton(page.$('.page-next'), page.fetchNext);
		page.listenTo(collection, 'reset', page.resetNavigator);
	},
	go: function(options) {
		this.options = options || {};
		this.reset();
		this.showPage();
		if (!this.lazy || (new Date()) - (this.lastRender || 0) > this.lazy) {
			var render = this.render;
			setTimeout(function() {
				try { render(); } catch (e) { MeiweiApp.handleError(e); }
			}, 350);
			this.lastRender = new Date();
		}
	},
	refresh: function() {
		this.showPage();
		this.lastRender = new Date();
		var render = this.render;
		setTimeout(function() {
			try { render(); } catch (e) { MeiweiApp.handleError(e); }
		}, 350);
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

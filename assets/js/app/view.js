
MeiweiApp.View = Backbone.View.extend({
    initialize: function() {
        this.delegateFastButtons();
        if (this.initView) this.initView();
    },
    displayError: function($el, text) {
        try {
            var error = JSON.parse(text);
            for (var k in error) { $el.html(error[k]);  break; };
        } catch (e) {
            $el.text(text);
        }
    },
    bindFastButton: function(el, handler) {
        this.fastButtons = this.fastButtons || [];
        var btn = new MBP.fastButton(el.length && el.length >= 1 ? el[0] : el, handler);
        this.fastButtons.push(btn);
        return btn;
    },
    delegateFastButtons: function() {
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
        if (this.model) {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'hide', this.remove);
        }
        if (this.initModelView) this.initModelView();
    },
    template: Mustache.compile(""),
    render: function() {
        var attrs = this.model ? this.model.toJSON() : {};
        this.$el.html(this.template(attrs));
        MeiweiApp.initLang(this.$el);
        return this;
    }
});

MeiweiApp.CollectionView = MeiweiApp.View.extend({
    ModelView: MeiweiApp.ModelView,
    initView: function() {
        if (this.collection) {
            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'remove', this.removeOne);
        }
        if (this.initCollectionView) this.initCollectionView();
    },
    removeOne: function(item) {
        item.trigger('hide');
    },
    addOne: function(item) {
        var modelView = new this.ModelView({model: item});
        this.$el.append(modelView.render().el);
    },
    addAll: function(_collection, options) {
    	if (options && options.previousModels) {
	    	_.each(options.previousModels, function(model) {
	       		model.trigger('hide');
	    	});
	    }
        if (this.collection) {
            var $list = [];
            this.collection.forEach(function(item) {
                var modelView = new this.ModelView({model: item});
                $list.push(modelView.render().el);
            }, this);
            this.$el.html($list);
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
    disablePage: function() {
        this.undelegateEvents();
        this.go = this.refresh = this.showPage = function() {};
    },
    initView: function() {
        if (!this.el) {
            this.disablePage();
            return;
        }
        this.views = {};
        _.bindAll(this, 'showPage', 'go', 'refresh', 'render', 'reset', 
                        'onClickLeftBtn', 'onClickRightBtn', 'initScroller');
        this.$('.scroll-inner').css('min-height', (this.$('.scroll').height() + 1) + 'px');
        var $el = this.$el;
        this.$('.wrapper').on('webkitAnimationEnd', function(e) {
            if (e.originalEvent.animationName == "slideouttoleft") {
            	$el.trigger('pageClose');
            } else if (e.originalEvent.animationName == "slideinfromright") {
            	$el.trigger('pageOpen');
            }
        });
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
            if (page.scroller) page.scroller.scrollTo(0, 0, 100);
            setTimeout(function() {
                collection.fetchNext({success: function(collection, xhr, options) {
                    page.resetNavigator(collection, xhr, options);
                }});
            }, 100);
        };
        page.fetchPrev = function() {
            if (page.scroller) page.scroller.scrollTo(0, 0, 100);
            setTimeout(function() {
                collection.fetchPrev({success: function(collection, xhr, options) {
                    page.resetNavigator(collection, xhr, options);
                }});
            }, 100);
        };
        page.resetNavigator = function() {
            page.$('.page-nav').toggleClass('hidden', (collection.next == null && collection.previous == null));
            page.$('.page-next').toggleClass('hidden', (collection.next == null));
            page.$('.page-prev').toggleClass('hidden', (collection.previous == null));
            if (page.scroller) page.initScroller();
        };
        page.$el.on('tap', '.page-prev', page.fetchPrev);
        page.$el.on('tap', '.page-next', page.fetchNext);
        page.listenTo(collection, 'reset', page.resetNavigator);
    },
    go: function(options) {
        this.options = options || {};
        this.reset();
        var timeout;
        var render = this.render, pageOpen = function() {
            clearTimeout(timeout);
            render();
        };
        timeout = setTimeout(pageOpen, 1000);
        this.$el.one('pageOpen', pageOpen);
        this.showPage();
    },
    refresh: function() {
        this.lastRender = new Date();
        var timeout;
        var render = this.render, pageOpen = function() {
            clearTimeout(timeout);
            render();
        };
        timeout = setTimeout(pageOpen, 1000);
        this.$el.one('pageOpen', pageOpen);
        this.showPage();
    },
    reset: function() {},
    showPage: function() {
        window.scrollTo(0, 0);
        if (this.$el && this.$el.hasClass('view-hidden')) {
            var $curPage = $('.view:not(".view-hidden")');
            var curPageCloseTimeout;
            var closeCurPage = function() {
                clearTimeout(curPageCloseTimeout);
                $curPage.removeClass('view-prev');
                $curPage.find('input').blur();
            };
            $curPage.addClass('view-hidden');
            $curPage.addClass('view-prev');
            curPageCloseTimeout = setTimeout(closeCurPage, 1000);
            $curPage.one('pageClose', closeCurPage);
            
            var $nextPage = this.$el;
            var nextPageOpenTimeout;
            var openNextPage = function() {
                clearTimeout(nextPageOpenTimeout);
                $nextPage.removeClass('view-next');
                $nextPage.find('input').blur();
                MeiweiApp.sendGaPageView($nextPage.attr('id')); // Google Analytics
            };
            $nextPage.removeClass('view-hidden');
            $nextPage.addClass('view-next');
            nextPageOpenTimeout = setTimeout(openNextPage, 1000);
            $nextPage.one('pageOpen', openNextPage);
            
            this.initScroller();
        }
    }
});

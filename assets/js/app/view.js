
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
            $el.html(text);
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
    addAll: function() {
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
    initView: function() {
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
            if (page.scroller) page.scroller.scrollTo(0, 0, 350);
            setTimeout(function() {
                collection.fetchNext({success: function(collection, xhr, options) {
                    page.resetNavigator(collection, xhr, options);
                }});
            }, 350);
        };
        page.fetchPrev = function() {
            if (page.scroller) page.scroller.scrollTo(0, 0, 350);
            setTimeout(function() {
                collection.fetchPrev({success: function(collection, xhr, options) {
                    page.resetNavigator(collection, xhr, options);
                }});
            }, 350);
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
    initPullToReresh: function(page) {
        if (!this.scroller) this.initScroller();
        var flip = false;
        page.$('.scroll').append($('<div class="scroll-hint">Pull down to refresh</div>'));
        page.scroller.on('scrollMoving', function () {
            if (page.scroller.y > 50 && !flip) {
                flip = true;
                page.$('.scroll-hint').html('Release to refresh');
            } else if (page.scroller.y < 50 && flip) {
                flip = false;
                page.$('.scroll-hint').html('Pull down to refresh');
            }
        });
        page.scroller.on('scrollEnd', function () {
            if (flip) {
                flip = false;
                page.refresh();
                page.$('.scroll-hint').html('Pull down to refresh');
                $('#apploader').removeClass('invisible');
            }
        });
    },
    checkLazy: function(timeout) { // timeout in minutes
        if ((new Date()) - (this.lastRender || 0) > timeout * 60 * 1000) {
            this.lastRender = new Date();
            return true;
        } else {
            return false;
        }
    },
    go: function(options) {
        this.options = options || {};
        this.reset();
        var render = this.render, rendered = false, pageOpen = function() {
        	if (!rendered) { rendered = true; render(); }
        };
        this.$el.one('pageOpen', pageOpen);
        setTimeout(pageOpen, 1000);
        this.showPage();
    },
    refresh: function() {
        this.lastRender = new Date();
        var render = this.render, rendered = false, pageOpen = function() {
        	if (!rendered) { rendered = true; render(); }
        };
        this.$el.one('pageOpen', pageOpen);
        setTimeout(pageOpen, 1000);
        this.showPage();
    },
    reset: function() {},
    showPage: function() {
        window.scrollTo(0, 0);
        if (this.$el && this.$el.hasClass('view-hidden')) {
            var $curPage = $('.view:not(".view-hidden")');
            var curPageClosed = false, closeCurPage = function() {
            	if (!curPageClosed) {
            		curPageClosed = true;
	            	$curPage.removeClass('view-prev');
	                $curPage.find('.wrapper input').attr('readonly', true);
	            }
            };
            $curPage.addClass('view-hidden');
            $curPage.addClass('view-prev');
            $curPage.one('pageClose', closeCurPage);
            setTimeout(closeCurPage, 1000);
            
            var $nextPage = this.$el;
            var nextPageOpened = false, openNextPage = function() {
            	if (!nextPageOpened) {
            		nextPageOpened = true;
	                $nextPage.removeClass('view-next');
	                $nextPage.find('.wrapper input').attr('readonly', false);
	            }
            };
            $nextPage.removeClass('view-hidden');
            $nextPage.addClass('view-next');
            $nextPage.one('pageOpen', openNextPage);
            setTimeout(openNextPage, 1000);
            
            this.initScroller();
        }
    }
});

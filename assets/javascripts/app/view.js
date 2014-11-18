(function() {
    
    MeiweiApp.View = Backbone.View.extend({
        initialize: function(options) {
            if (this.initView) this.initView(options || {});
        },
        renderTemplate: function(attrs, template) {
            var template = template || _.result(this, 'template') || '';
            var attrs = this.mixinTemplateHelpers(attrs);
            this.$el.html(Mustache.render(template, attrs));
            this.$el.find('img[data-src]').addBack('img[data-src]').each(function() {
                MeiweiApp.loadImage($(this), $(this).data('src'));
            });
            this.$el.find('.img[data-bg-src]').addBack('.img[data-bg-src]').each(function() {
                MeiweiApp.loadBgImage($(this), $(this).data('bg-src'));
            });
            MeiweiApp.initLang(this.$el);
            return this;
        },
        mixinTemplateHelpers: function(target){
            var target = target || {};
            return _.extend(target, _.result(this, 'templateHelpers'));
        },
        displayError: function($el, text) {
            try {
                var error = JSON.parse(text);
                for (var k in error) { $el.html(error[k]);  break; };
            } catch (e) {
                $el.text(text || 'Error');
            }
        },
        displayErrorBetter: function($form, error) {
            try {
                error = JSON.parse(error);
                for (var name in error) {
                    var $input = $form.find('[name=' + name + ']');
                    if (!_.isEmpty($input)) {
                        $input.addClass('error');
                        var node="<div class='hint'>"+error[name]+"</div>";
                        if(name=='airport'){
                        	node="<div class='hint label'>"+error[name]+"</div>";
                        }
                        var n=$input.after(node);
                        $input.next('.hint').one('click',function(){
                        	$(this).prev().unbind('change');
                        	$(this).prev().removeClass('error');
                        	var $input=$(this).prev();
                            $(this).remove();
                            $input.trigger('focus');
                        })
                        $input.one('change', function() {
                            $(this).removeClass('error');
                            $(this).next('.hint').remove();
                        });
                    }
                }
                if (error['non_field_errors']) {
                    $form.find('.info-text').text(error['non_field_errors']);
                }
                $form.one('submit', function() {
                    $form.find('[name].error').removeClass('error');
                    $form.find('.info-text').empty();
                });
            } catch (e) {
                $form.find('.info-text').text(error || 'Error');
            }
        }
    });
    
    
    MeiweiApp.ModelView = MeiweiApp.View.extend({
        listenToModel: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'hide', this.hide);
        },
        initView: function(options) {
            this.model = this.model || new Model();
            this.listenToModel();
            if (this.initModelView) this.initModelView(options || {});
        },
        setModel: function(model) {
            this.stopListening(this.model);
            this.model = model;
            this.listenToModel();
        },
        hide: function() {
            this.$el.animate({
                opacity: 0
            }, 1000, function() {
                $(this).remove();
            });
        },
        serializeData: function() {
            return this.model ? this.model.toJSON() : {};
        },
        render: function() {
            return this.renderTemplate(this.serializeData());
        }
    });
    
    
    MeiweiApp.CollectionView = MeiweiApp.View.extend({
        ModelView: MeiweiApp.ModelView,
        listenToCollection: function() {
            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'remove', this.removeOne);
        },
        initView: function(options) {
            options = options || {};
            this.reverse = (options.reverse === true);
            this.collection = this.collection || new Collection();
            this.listenToCollection();
            if (this.initCollectionView) this.initCollectionView(options);
        },
        setCollection: function(collection) {
            this.stopListening(this.collection);
            this.collection = collection;
            this.listenToCollection();
        },
        renderItem: function(item) {
            var modelView = new this.ModelView({model: item});
            return modelView.render().el;
        },
        removeOne: function(item) {
            item.trigger('hide');
        },
        addOne: function(item) {
            var method = this.reverse ? 'prepend' : 'append';
            this.$el[method](this.renderItem(item));
        },
        addAll: function(_collection, options) {
            if (options && options.previousModels) {
                _.each(options.previousModels, function(model) {
                    model.trigger('hide');
                });
            }
            if (this.collection) {
                var nodelist = this.collection.reduce(function(nodelist, item) {
                    return nodelist.concat(this.renderItem(item));
                }, [], this);
                this.$el.html(this.reverse ? nodelist.reverse() : nodelist);
            }
        },
        render: function() {
            this.addAll();
            return this;
        }
    });
    
    MeiweiApp.PageView = MeiweiApp.View.extend({
        events: {
            'click .header-btn-left': 'onClickLeftBtn',
            'click .header-btn-right': 'onClickRightBtn'
        },
        disablePage: function() {
            this.undelegateEvents();
            this.go = function() {};
            this.refresh = function() {};
            this.showPage = function() {};
            this.onResume = function() {};
        },
        initView: function() {
            if (!this.el) {
                this.disablePage();
                return;
            }
            this.views = {};
            _.bindAll(this, 'showPage', 'go', 'leave', 'refresh', 'onResume', 'render', 'reset', 
                            'onClickLeftBtn', 'onClickRightBtn');
            var $el = this.$el;
            this.$('.wrapper').on('webkitAnimationEnd', function(e) {
                var animationName = e.originalEvent.animationName;
                if (animationName == "slideouttoleft" || animationName == "slideouttoright") {
                    $el.trigger('pageClose');
                } else if (animationName == "slideinfromright" || animationName == "slideinfromleft") {
                    $el.trigger('pageOpen');
                }
            });
            if (this.initPage) this.initPage();
        },
        onClickLeftBtn: function() { MeiweiApp.goBack(); },
        onClickRightBtn: function() {},
        initPageNav: function(page, collection) {
            var fetching = false;
            page.resetNavigator = function() {
                fetching = false;
                page.$('.null-list-help').toggleClass('hidden', collection.length > 0);
                page.$('.page-nav').toggleClass('hidden', collection.next == null);
            };
            page.fetchMore = function() {
                if (fetching || !collection.next) return;
                fetching = true;
                collection.fetchNext({
                    remove: false, success: page.resetNavigator, error: page.resetNavigator
                });
            };
            var viewportHeight = $(window).height() + 50;
            page.$('.wrapper').scroll(function() {
                if (page.$el.hasClass('view-hidden')) return;
                if (page.$('.page-nav').offset().top < viewportHeight) {
                    setTimeout(function() { page.fetchMore(); }, 1000);
                }
            });
            page.listenTo(collection, 'reset', page.resetNavigator);
        },
        leave: function() {},
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
            var timeout;
            var render = this.render, pageOpen = function() {
                clearTimeout(timeout);
                render();
            };
            timeout = setTimeout(pageOpen, 1000);
            this.$el.one('pageOpen', pageOpen);
            this.showPage();
        },
        onResume: function() {},
        reset: function() {},
        showPage: function(options) {
            var options = options || {};
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
                if (options.reverse) $curPage.addClass('view-prev-reverse');
                curPageCloseTimeout = setTimeout(closeCurPage, 1000);
                $curPage.one('pageClose', closeCurPage);
                
                var $nextPage = this.$el;
                var nextPageOpenTimeout;
                var openNextPage = function() {
                    clearTimeout(nextPageOpenTimeout);
                    $nextPage.removeClass('view-next').removeClass('view-next-reverse');
                    $nextPage.find('input').blur();
                    MeiweiApp.sendGaPageView($nextPage.attr('id')); // Google Analytics
                    window.scrollTo(0, 0);
                };
                $nextPage.removeClass('view-hidden');
                $nextPage.addClass('view-next');
                if (options.reverse) $nextPage.addClass('view-next-reverse');
                nextPageOpenTimeout = setTimeout(openNextPage, 1000);
                $nextPage.one('pageOpen', openNextPage);
            }
        }
    });

})();

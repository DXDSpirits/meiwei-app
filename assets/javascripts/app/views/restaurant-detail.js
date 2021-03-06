(function() {
    var ProfileBox = MeiweiApp.View.extend({
    	events: { 'click .order-button': 'goToOrder' },
    	initView: function() {
    		this.listenTo(this.model, 'change', this.render);
    	},
    	goToOrder: function() {
    		MeiweiApp.goTo('RestaurantOrder', {
    			restaurant: this.model.toJSON()
    		});
    	},
    	render: function() {
    		var resto = this.model.toJSON();
    		this.$('article p').html(resto.description);
    		this.$('.address').toggleClass('hidden', _.isEmpty(resto.address));
    		this.$('.address p').html(resto.address);
    		this.$('.workinghour').toggleClass('hidden', _.isEmpty(resto.workinghour));
    		this.$('.workinghour p').html(resto.workinghour);
    		this.$('.parking').toggleClass('hidden', _.isEmpty(resto.parking));
    		this.$('.parking p').html(resto.parking);
    		this.$('.discount').toggleClass('hidden', _.isEmpty(resto.discount));
    		this.$('.discount p').html(resto.discount);
    		this.$('.rating').attr('class', 'rating r-' + resto.score);
            this.$('.price-tags').html(resto.price < 10 ? new Array(resto.price+1).join('￥') : '￥' + resto.price);
    		return this;
    	}
    });
    
    var ReviewList = MeiweiApp.CollectionView.extend({
        ModelView: MeiweiApp.ModelView.extend({
            template: '<div class="avatar"></div><p>{{{ comments }}}</p>',
            className: 'review-list-item',
        })
    });
    
    MeiweiApp.Pages.RestaurantDetail = new (MeiweiApp.PageView.extend({
        events: {
            'click .header-btn-left': 'onClickLeftBtn',
            'click .header-btn-right': 'onClickRightBtn',
            'click .img-stack-icon': 'viewPictures',
            'click .btn-share-wechat': 'onClickWechatBtn',
            'click .btn-share-weixin': 'onClickMomentsBtn',
            'click .btn-share-weibo': 'onClickWeiboBtn'
        },
    	initPage: function() {
    		this.restaurant = new MeiweiApp.Models.Restaurant();
    		this.pictures = new MeiweiApp.Collections.Pictures();
    		this.reviews = new MeiweiApp.Collections.Reviews();
    		this.views = {
    			restaurantProfileBox: new ProfileBox({ model: this.restaurant, el: this.$('.restaurant-profile') }),
    			reviews: new ReviewList({ collection: this.reviews, el: this.$('.restaurant-reviews > div') })
    		};
    		_.bindAll(this, 'renderAll');
    	},
    	onClickRightBtn: function() { this.addFavorite(); },
        getWeiboLink : function(s, d, e, r, l, p, t, z, c) {
            var f = 'http://v.t.sina.com.cn/share/share.php?appkey=', u = z || d.location,
            p = ['&url=', e(u), '&title=', e(t || d.title), '&source=', e(r), '&sourceUrl=', e(l), 
                '&content=', c || 'gb2312', '&pic=', e(p || ''), '&ralateUid=', '3058840707'].join('');
            return [f, p].join('');
        },
        getShareMessage: function() {
            return {
                url: 'http://mobile.clubmeiwei.com/#restaurant/' + this.restaurant.id,
                content: this.restaurant.get('fullname') + ' 地址：' + this.restaurant.get('address'),
                pic: this.restaurant.get('frontpic')
            }
        },
        onClickWeiboBtn : function() {
            var message = this.getShareMessage();
            var link = this.getWeiboLink(screen, document, encodeURIComponent,
                                         'http://www.clubmeiwei.com', 'http://www.clubmeiwei.com',
                                         message.pic, message.content, message.url, 'utf-8');
            var ref = MeiweiApp.openWindow(link);
            MeiweiApp.sendGaSocial('weibo', 'tweet', 'restaurant');
        },
        onClickWechatBtn: function() {
            var message = this.getShareMessage();
            MeiweiApp.sendWeixinLink(message.url, message.content, message.pic);
            MeiweiApp.sendGaSocial('weixin', 'share to friend', 'restaurant');
        },
        onClickMomentsBtn: function() {
            var message = this.getShareMessage();
            MeiweiApp.shareToMoments(message.url, message.content, message.pic);
            MeiweiApp.sendGaSocial('weixin', 'share to moments', 'restaurant');
        },
    	viewPictures: function() {
    	    MeiweiApp.goTo('RestaurantPictures', {pictures: this.restaurant.get('pictures')});
    	},
    	addFavorite: function() {
    		if (this.$('.icon-favorite').hasClass('succeed')) return;
    		var self = this;
    		MeiweiApp.me.favorites.create({restaurant: this.restaurant.id}, {
    			success: function() {
    				self.$('.icon-favorite').addClass('succeed');
    			}
    		});
    	},
    	reset: function() {
    		this.$('.header-title').empty();
    		this.$('.wrapper').addClass('rendering');
    		this.$('.wrapper').css('background-image', 'none');
    	},
    	renderReviews: function() {
    	    if (!this.restaurant.get('reviews_control')) return;
    	    var self = this;
            this.reviews.fetch({ reset: true, url: this.restaurant.get('reviews'), success: function(collection) {
                if (collection.length > 0) {
                    self.$('.restaurant-reviews').removeClass('hidden');
                } else {
                    self.$('.restaurant-reviews').addClass('hidden');
                }
            }});
    	},
    	renderAll: function() {
    		var succeed = MeiweiApp.me.favorites.find(function(favorite) {
    			return (this.restaurant.id == favorite.get('restaurant'));
    		}, this);
    		this.$('.icon-favorite').toggleClass('succeed', (succeed != null));
    		this.$('.header-title').html(this.restaurant.get('fullname'));
            MeiweiApp.loadBgImage(this.$('.wrapper'), this.restaurant.get('frontpic'), {
    			height: 250
    		});
    		//MeiweiApp.loadBgImage($('body'), this.restaurant.get('frontpic'), { height: 250 });
    		this.$('.wrapper').removeClass('rendering');
    		this.renderReviews();
    	},
    	render: function() {
    		if (this.options.restaurant) {
    			this.restaurant.set(this.options.restaurant);
    			this.renderAll();
    		} else if (this.options.restaurantId) {
    			this.restaurant.clear();
    			this.restaurant.set({id: this.options.restaurantId});
    			this.restaurant.fetch({ success: this.renderAll });
    		}
    	}
    }))({el: $("#view-restaurant-detail")});
})();

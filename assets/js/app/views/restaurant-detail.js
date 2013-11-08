$(function() {
    var ProfileBox = MeiweiApp.View.extend({
    	events: { 'tap .order-button': 'goToOrder' },
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
    		this.$('.address').toggleClass('hide', _.isEmpty(resto.address));
    		this.$('.address p').html(resto.address);
    		this.$('.workinghour').toggleClass('hide', _.isEmpty(resto.workinghour));
    		this.$('.workinghour p').html(resto.workinghour);
    		this.$('.parking').toggleClass('hide', _.isEmpty(resto.parking));
    		this.$('.parking p').html(resto.parking);
    		this.$('.discount').toggleClass('hide', _.isEmpty(resto.discount));
    		this.$('.discount p').html(resto.discount);
    		this.$('.rating').attr('class', 'rating r-' + resto.score);
            this.$('.price-tags').html(resto.price < 10 ? new Array(resto.price+1).join('￥') : '￥' + resto.price);
    		return this;
    	}
    });
    
    var ReviewList = MeiweiApp.CollectionView.extend({
        ModelView: MeiweiApp.ModelView.extend({
            template: Mustache.compile('<div class="avatar"></div><p>{{{ comments }}}</p>'),
            className: 'review-list-item',
        })
    });
    
    MeiweiApp.Pages.RestaurantDetail = new (MeiweiApp.PageView.extend({
        events: {
            'fastclick .header-btn-left': 'onClickLeftBtn',
            'fastclick .header-btn-right': 'onClickRightBtn',
            'tap .restaurant-pictures': 'viewPictures'
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
    		this.$('.wrapper').addClass('rendering');
    		this.$('> header h1').empty();
    	},
    	renderReviews: function() {
    	    var self = this;
            this.reviews.fetch({ reset: true, url: this.restaurant.get('reviews'), success: function(collection) {
                if (collection.length > 0) {
                    self.$('.restaurant-reviews').removeClass('hidden');
                } else {
                    self.$('.restaurant-reviews').addClass('hidden');
                }
                self.initScroller();
            }});
    	},
    	renderAll: function() {
    		var succeed = MeiweiApp.me.favorites.find(function(favorite) {
    			return (this.restaurant.id == favorite.get('restaurant'));
    		}, this);
    		this.$('.icon-favorite').toggleClass('succeed', (succeed != null));
    		this.$('> header h1').html(this.restaurant.get('fullname'));
            this.$('.restaurant-pictures .img-cover').attr('src', this.restaurant.get('frontpic'));
            this.$('.bottom-banner').html($('<img>').attr('src', this.restaurant.get('frontpic')));
    		this.initScroller();
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
});

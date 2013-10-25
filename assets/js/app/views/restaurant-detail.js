$(function() {
    MeiweiApp.Views.RestaurantProfileBox = MeiweiApp.View.extend({
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
    		return this;
    	}
    });
    
    MeiweiApp.Views.RestaurantPictureList = MeiweiApp.CollectionView.extend({
    	ModelView: MeiweiApp.ModelView.extend({
    		tagName: 'img',
    		template: Mustache.compile('{{{ path }}}'),
    		render: function() {
    			this.$el.attr('src', this.template(this.model.toJSON()));
    			return this;
    		}
    	})
    });
    
    MeiweiApp.Pages.RestaurantDetail = new (MeiweiApp.PageView.extend({
    	initPage: function() {
    		this.restaurant = new MeiweiApp.Models.Restaurant();
    		this.views = {
    			restaurantProfileBox: new MeiweiApp.Views.RestaurantProfileBox({
    				model: this.restaurant,
    				el: this.$('.restaurant-profile')
    			}),
    			pictures: new MeiweiApp.Views.RestaurantPictureList({
    				collection: new MeiweiApp.Collections.Pictures(),
    				el: this.$('.restaurant-pictures')
    			})
    		};
    		_.bindAll(this, 'renderAll', 'carousel');
    	},
    	carousel: function() {
    		var itv = null;
    		if (itv) clearInterval(itv);
    		var A = this.$('.restaurant-pictures img');
    		var L = A.length;
    		var i = 0;
    		$(A[i]).addClass('front');
    		return;
    		var timedCount = function() {
    			if (i >= L - 1) {
    				clearInterval(itv);
    				return;
    			}
    			$(A[i]).removeClass('front');
    			$(A[i]).addClass('back');
    			$(A[i + 1]).addClass('front');
    			i += 1;
    		};
    		itv = setInterval(timedCount, 3000);
    	},
    	onClickRightBtn: function() { this.addFavorite(); },
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
    	renderAll: function() {
    		var succeed = MeiweiApp.me.favorites.find(function(favorite) {
    			return (this.restaurant.id == favorite.get('restaurant'));
    		}, this);
    		this.$('.icon-favorite').toggleClass('succeed', (succeed != null));
    		this.$('> header h1').html(this.restaurant.get('fullname'));
    		var pictures = this.restaurant.get('pictures');
    		if (_.isEmpty(pictures) || true) {
    			var img = $('<img></img>').attr('src', MeiweiApp.Pages.RestaurantDetail.restaurant.get('frontpic'));
    			this.views.pictures.$el.html(img);
    			this.$('.bottom-banner').html(img.clone());
    		} else {
    			this.views.pictures.collection.reset(this.restaurant.get('pictures'));
    			//this.carousel();
    		}
    		this.initScroller();
    		this.$('.wrapper').removeClass('rendering');
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

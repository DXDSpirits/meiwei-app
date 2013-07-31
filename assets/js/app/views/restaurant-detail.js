
MeiweiApp.Views.RestaurantProfileBox = MeiweiApp.ModelView.extend({
	template: MeiweiApp.Templates['restaurant-profile-box'],
	render: function() {
		var data = this.model.toJSON();
		data.parkingAvailable = (!_.isEmpty(data.parking));
		data.discountAvailable = (!_.isEmpty(data.discount));
		data.workinghourAvailable = (!_.isEmpty(data.workinghour));
		this.$el.html(this.template(data));
		var self = this;
		new MBP.fastButton(this.$('.order-button')[0], function() {
			MeiweiApp.goTo('RestaurantOrder', {
				restaurant: self.model.toJSON(),
				restaurantId: self.model.id
			});
		});
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

MeiweiApp.Views.RestaurantReviewList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		template: MeiweiApp.Templates['restaurant-review-item']
	}),
	template: MeiweiApp.Templates['restaurant-review'],
	addOne: function(item) {
		var modelView = new this.ModelView({model: item});
		this.modelViews.push(modelView);
		this.$('section').append(modelView.render().el);
	},
	addAll: function() {
		this.$el.html(this.template({count: this.collection.length}));
		this.collection.forEach(this.addOne, this);
	}
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
			}),
			reviews: new MeiweiApp.Views.RestaurantReviewList({
				collection: new MeiweiApp.Collections.Reviews(),
				el: this.$('.restaurant-reviews')
			})
		}
		_.bindAll(this, 'renderAll', 'carousel');
	},
	carousel: function() {
		if (this.itv) {
			clearInterval(this.itv);
		}
		var A = this.$('.restaurant-pictures img');
		var L=A.length;
		var i=0;
		$(A[i]).addClass('front');
		var timedCount = function() {
			$(A[i]).removeClass('front');
			$(A[(i+1)%L]).addClass('front');
			i=(i+1)%L;
		}
		this.itv = setInterval(timedCount, 3000);
	},
	onClickRightBtn: function() { this.addFavorite(); },
	addFavorite: function() {
		var fav = new MeiweiApp.Models.Favorite({
			restaurant: this.restaurant.id
		});
		var self = this;
		fav.save({}, {success: function() {
			self.$('.icon-favorite').addClass('suceed');
			//setTimeout(function() { self.$('.icon-favorite').removeClass('suceed'); }, 1000);
		}});
	},
	renderAll: function() {
		this.$('> header h1').html(this.restaurant.get('fullname'));
		this.views.reviews.collection.url = this.restaurant.get('reviews');
		this.views.pictures.collection.reset(this.restaurant.get('pictures'));
		//this.carousel();
		this.showPage();
	},
	render: function() {
		if (this.options.restaurant) {
			this.restaurant.set(this.options.restaurant);
			this.renderAll();
		} else if (this.options.restaurantId) {
			this.restaurant.clear();
			this.restaurant.set({id: this.options.restaurantId});
			this.restaurant.fetch({ success: this.renderAll })
		}
	}
}))({el: $("#view-restaurant-detail")});

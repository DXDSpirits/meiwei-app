
MeiweiApp.Views.RestaurantProfileBox = MeiweiApp.ModelView.extend({
	template: MeiweiApp.Templates['restaurant-profile-box'],
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		var self = this;
		new MBP.fastButton(this.$('.order-button')[0], function() {
			MeiweiApp.goTo('RestaurantOrder', {
				restaurant: self.model.toJSON()
			});
		});
		return this;
	}
});

MeiweiApp.Views.RestaurantPictureList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		tagName: 'img',
		template: MeiweiApp.Templates['restaurant-picture'],
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
	addFavorite: function() {},
	renderAll: function() {
		this.$('> header h1').html(this.restaurant.get('fullname'));
		this.views.pictures.collection.url = this.restaurant.get('pictures');
		this.views.reviews.collection.url = this.restaurant.get('reviews');
		var self = this;
		$.when(
			this.views.pictures.collection.fetch({reset: true}),
			this.views.reviews.collection.fetch({reset: true})
		).then(function() {
			self.carousel();
			self.showPage();
		});
	},
	render: function(options) {
		this.options = this.options || {};
		_.extend(this.options, options);
		if (options.restaurant) {
			this.restaurant.set(options.restaurant);
			this.renderAll();
		} else if (options.restaurantId) {
			this.restaurant.clear();
			this.restaurant.set({id: options.restaurantId});
			this.restaurant.fetch({ success: this.renderAll })
		}
	}
}))({el: $("#view-restaurant-detail")});

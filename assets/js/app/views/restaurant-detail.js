
MeiweiApp.Views.RestaurantProfileBox = MeiweiApp.ModelView.extend({
	template: MeiweiApp.Templates['restaurant-profile-box'],
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
		template: MeiweiApp.Templates['restaurant-review-item'],
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
	},
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
				collection: this.restaurant.pictures,
				el: this.$('.restaurant-pictures')
			}),
			reviews: new MeiweiApp.Views.RestaurantReviewList({
				collection: this.restaurant.reviews,
				el: this.$('.restaurant-reviews')
			})
		}
		_.bindAll(this, 'renderAll');
	},
	renderAll: function() {
		this.$('> header h1').html(this.restaurant.get('fullname'));
		$.when(
			this.restaurant.pictures.fetch({reset: true}),
			this.restaurant.reviews.fetch({reset: true})
		).then(this.showPage);
	},
	render: function() {
		this.restaurant.clear();
		this.restaurant.set({id: arguments[0]});
		this.restaurant.fetch({ success: this.renderAll })
	}
}))({el: $("#view-restaurant-detail")});

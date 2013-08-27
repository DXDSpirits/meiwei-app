
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
				restaurant: self.model.toJSON()
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
		}
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
		}
		itv = setInterval(timedCount, 3000);
	},
	onClickRightBtn: function() { this.addFavorite(); },
	addFavorite: function() {
		if (this.$('.icon-favorite').hasClass('suceed')) return;
		var self = this;
		MeiweiApp.me.favorites.create({restaurant: this.restaurant.id}, {
			success: function() {
				self.$('.icon-favorite').addClass('suceed');
			}
		});
	},
	renderAll: function() {
		if (MeiweiApp.me.favorites.find(function(favorite) { return (this.restaurant.id == favorite.get('restaurant')); }, this)) {
			this.$('.icon-favorite').addClass('suceed');
		} else {
			this.$('.icon-favorite').removeClass('suceed');
		}
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

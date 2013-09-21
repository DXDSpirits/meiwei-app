
MeiweiApp.Views.MemberProfileBox = MeiweiApp.View.extend({
	initialize: function() {
		_.bindAll(this, 'changeAvatar');
		this.bindFastButton(this.$('.avatar'), this.changeAvatar);
	},
	changeAvatar: function() {
		function onSuccess(imageData) {
			localStorage.setItem('avatar', imageData);
		    this.$('.avatar img')[0].src = "data:image/jpeg;base64," + imageData;
		}
		navigator.camera.getPicture(
			function(imageData) { onSuccess(imageData); }, function() {}, {
				quality: 50, allowEdit: true, encodingType: Camera.EncodingType.JPEG,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY
			}
		);
	},
	render: function() {
		MeiweiApp.me.fetch({
			success: function(model, response, options) {
				var profile = MeiweiApp.me.profile.toJSON();
				options.view.$('[data-field=nickname]').html(profile.nickname);
				options.view.$('[data-field=mobile]').html(profile.mobile);
				options.view.$('[data-field=email]').html(profile.email);
				var imageData = localStorage.getItem('avatar');
				if (imageData) {
					options.view.$('.avatar img')[0].src = "data:image/jpeg;base64," + imageData;
				} else {
					options.view.$('.avatar img')[0].src = "assets/img/logo@2x.png";
				}
			}, view: this
		});
		return this;
	}
});


MeiweiApp.Views.FavoriteRestoCarousel = MeiweiApp.View.extend({
	render: function() {
		this.collection.fetch({
			success: function(collection, response, options) {
				var path = 'assets/img/default.png';
				if (collection.length > 0) {
					var ran = _.random(0, collection.length - 1);
					var model = collection.at(ran);
					path = model.get('restaurantinfor').frontpic;
				}
				options.view.$el.html($('<img></img>').attr('src', path));
			}, reset: true, view: this 
		});
		return this;
	}
});


MeiweiApp.Pages.MemberCenter = new (MeiweiApp.PageView.extend({
	onClickLeftBtn:   function() { MeiweiApp.goTo('Home'); },
	gotoMyProfile:    function() { MeiweiApp.goTo('MemberProfile'); },
	gotoMyOrder:      function() { MeiweiApp.goTo('OrderList'); },
	gotoMyCredits:    function() { MeiweiApp.goTo('MemberCredits'); },
	gotoMyFavorites:  function() { MeiweiApp.goTo('MemberFavorites'); },
	gotoViewProducts: function() { MeiweiApp.goTo('ProductPurchase'); },
	gotoMyAnniversaries: function() { MeiweiApp.goTo('MemberAnniversaries'); },
	logout:           function() {
		MeiweiApp.me.logout();
		MeiweiApp.goTo('Home');
	},
	initPage: function() {
		this.lazy = 5 * 60 * 1000;
		this.listenTo(MeiweiApp.me, 'logout', function() { this.lastRender = null; });
		this.listenTo(MeiweiApp.me, 'login', function() { this.lastRender = null; });
		this.bindFastButton(this.$('.member-center-nav > li:nth-child(1)'), this.gotoMyProfile);
		this.bindFastButton(this.$('.member-center-nav > li:nth-child(2)'), this.gotoMyOrder);
		this.bindFastButton(this.$('.member-center-nav > li:nth-child(3)'), this.gotoMyCredits);
		this.bindFastButton(this.$('.member-center-nav > li:nth-child(4)'), this.gotoMyFavorites);
		this.bindFastButton(this.$('.member-center-nav > li:nth-child(5)'), this.gotoViewProducts);
		this.bindFastButton(this.$('.member-center-nav > li:nth-child(6)'), this.gotoMyAnniversaries);
		this.bindFastButton(this.$('.logout-button'), this.logout);
		this.favorites = MeiweiApp.me.favorites;
		this.views = {
			profileBox: new MeiweiApp.Views.MemberProfileBox({
				model: MeiweiApp.me.profile,
				el: this.$('.member-profile-box')
			}),
			favoriteCarousel: new MeiweiApp.Views.FavoriteRestoCarousel({
				collection: this.favorites,
				el: this.$('.favorite-resto-carousel')
			})
		}
	},
	render: function() {
		this.views.profileBox.render();
		this.views.favoriteCarousel.render();
	}
}))({el: $("#view-member-center")});

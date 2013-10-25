$(function() {
    var MemberProfileBox = MeiweiApp.View.extend({
    	events: { 'tap .avatar': 'changeAvatar' },
    	initView: function() {
    	    _.bindAll(this, 'updateProfile');
            this.listenTo(MeiweiApp.me.profile, 'change', this.updateProfile);
        },
    	changeAvatar: function() {
    		function onSuccess(imageData) {
    			localStorage.setItem('avatar', imageData);
    		    this.$('.avatar img')[0].src = "data:image/jpeg;base64," + imageData;
    		}
    		if (navigator.camera && _.isFunction(navigator.camera.getPicture)) {
        		navigator.camera.getPicture(
        			function(imageData) { onSuccess(imageData); }, function() {}, {
        				quality: 50, allowEdit: true, encodingType: Camera.EncodingType.JPEG,
        				destinationType: Camera.DestinationType.DATA_URL,
        				sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        			}
        		);
        	}
    	},
    	updateProfile: function() {
    	    var profile = MeiweiApp.me.profile.toJSON();
    	    this.$('[data-field=nickname]').html(profile.nickname);
            this.$('[data-field=mobile]').html(profile.mobile);
            this.$('[data-field=email]').html(profile.email);
    	},
    	render: function() {
    	    var imageData = localStorage.getItem('avatar');
            if (imageData) {
                this.$('.avatar img')[0].src = "data:image/jpeg;base64," + imageData;
            } else {
                this.$('.avatar img')[0].src = "assets/img/default-avatar@2x.png";
            }
    		MeiweiApp.me.fetch();
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
    	events: {
    		'fastclick .header-btn-left': 'onClickLeftBtn',
    		'fastclick .header-btn-right': 'onClickRightBtn',
    		'tap .member-center-nav > li:nth-child(1)': 'gotoMyProfile',
    		'tap .member-center-nav > li:nth-child(2)': 'gotoMyOrder',
    		'tap .member-center-nav > li:nth-child(3)': 'gotoMyCredits',
    		'tap .member-center-nav > li:nth-child(4)': 'gotoMyFavorites',
    		'tap .member-center-nav > li:nth-child(5)': 'gotoViewProducts',
    		'tap .member-center-nav > li:nth-child(6)': 'gotoMyAnniversaries',
    		'tap .logout-button': 'logout'
    	},
    	onClickLeftBtn:      function() { MeiweiApp.goTo('Home'); },
    	onClickRightBtn:      function() { MeiweiApp.goTo('Settings'); },
    	gotoMyProfile:       function() { MeiweiApp.goTo('MemberProfile'); },
    	gotoMyOrder:         function() { MeiweiApp.goTo('OrderList'); },
    	gotoMyCredits:       function() { MeiweiApp.goTo('MemberCredits'); },
    	gotoMyFavorites:     function() { MeiweiApp.goTo('MemberFavorites'); },
    	gotoViewProducts:    function() { MeiweiApp.goTo('ProductPurchase'); },
    	gotoMyAnniversaries: function() { MeiweiApp.goTo('MemberAnniversaries'); },
    	logout: function() {
    		MeiweiApp.me.logout();
    		MeiweiApp.goTo('Home');
    	},
    	initPage: function() {
    		this.lazy = 5 * 60 * 1000;
    		this.listenTo(MeiweiApp.me, 'logout', function() { this.lastRender = null; });
    		this.listenTo(MeiweiApp.me, 'login', function() { this.lastRender = null; });
    		this.favorites = MeiweiApp.me.favorites;
    		this.views = {
    			profileBox: new MemberProfileBox({
    				model: MeiweiApp.me.profile,
    				el: this.$('.member-profile-box')
    			}),
    			favoriteCarousel: new MeiweiApp.Views.FavoriteRestoCarousel({
    				collection: this.favorites,
    				el: this.$('.favorite-resto-carousel')
    			})
    		};
    	},
    	render: function() {
    		this.views.profileBox.render();
    		this.views.favoriteCarousel.render();
    		var key = 'visited-view-member-center';
    		if (!localStorage.getItem(key)) {
    		    localStorage.setItem(key, true);
    		    MeiweiApp.showConfirmDialog(
    		        MeiweiApp._('Share Meiwei with your friends'),
    		        MeiweiApp._('You will receive a gift after sharing'),
    		        function() { MeiweiApp.goTo('Settings'); }
    		    );
    		}
    	}
    }))({el: $("#view-member-center")});
});

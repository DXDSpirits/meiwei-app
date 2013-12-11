$(function() {
    var MemberProfileBox = MeiweiApp.View.extend({
    	events: { 'fastclick .avatar': 'changeAvatar' },
    	initView: function() {
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
    		return this;
        }
    });
    
    MeiweiApp.Views.FavoriteRestoCarousel = MeiweiApp.View.extend({
    	initView: function() {
	        this.listenTo(MeiweiApp.me.favorites, 'reset', this.pickImage);
	    },
        pickImage: function() {
            var favorites = MeiweiApp.me.favorites;
            if (favorites.length > 0) {
                var ran = _.random(0, favorites.length - 1);
                var model = favorites.at(ran);
	            MeiweiApp.loadBgImage(this.$el, model.get('restaurantinfor').frontpic, {
	    			src_local: 'assets/img/bootstrap/restaurant/' + model.get('restaurantinfor').id + '.jpg',
	    			height: 250
	    		});
            } else {
            	this.$el.css('background-image', 'url(assets/img/default.png)');
            }
        }
    });
    
    MeiweiApp.Pages.MemberCenter = new (MeiweiApp.PageView.extend({
    	events: {
    		'fastclick .header-btn-left': 'onClickLeftBtn',
    		'fastclick .header-btn-right': 'onClickRightBtn',
    		//'fastclick .member-center-nav > li:nth-child(1)': 'gotoMyProfile',
    		'fastclick .edit-profile': 'gotoMyProfile',
    		'fastclick .member-center-nav > li:nth-child(2)': 'gotoMyOrder',
    		'fastclick .member-center-nav > li:nth-child(3)': 'gotoMyCredits',
    		'fastclick .member-center-nav > li:nth-child(4)': 'gotoMyFavorites',
    		'fastclick .member-center-nav > li:nth-child(5)': 'gotoViewProducts',
    		'fastclick .member-center-nav > li:nth-child(6)': 'gotoMyAnniversaries',
    		'fastclick .logout-button': 'logout'
    	},
    	onClickRightBtn:     function() { MeiweiApp.goTo('Settings'); },
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
    		this.listenTo(MeiweiApp.me, 'logout', function() { this.lastRender = null; });
    		this.listenTo(MeiweiApp.me, 'login', function() { this.lastRender = null; });
    		this.views = {
    			profileBox: new MemberProfileBox({
    				el: this.$('.member-profile-box')
    			}),
    			favoriteCarousel: new MeiweiApp.Views.FavoriteRestoCarousel({
    				el: this.$('.favorite-resto-carousel')
    			})
    		};
    		_.bindAll(this, 'askToShare');
    	},
    	askToShare: function() {
	        var key = 'visited-view-member-center';
	        var lastTime = localStorage.getItem(key);
            if (!lastTime || !(new Date() - new Date(lastTime)) || 
                new Date() - new Date(lastTime) > 30 * 24 * 60 * 60 * 1000) {
                localStorage.setItem(key, (new Date()).toISOString());
                MeiweiApp.showConfirmDialog(
                    MeiweiApp._('Share Meiwei with your friends'),
                    MeiweiApp._('You will receive a gift after sharing'),
                    function() { MeiweiApp.goTo('Settings'); }
                );
            }
    	},
    	render: function() {
    	    this.views.profileBox.render();
    		MeiweiApp.me.fetch({ success: this.askToShare });
    		MeiweiApp.me.favorites.fetch({ reset: true });
    	}
    }))({el: $("#view-member-center")});
});

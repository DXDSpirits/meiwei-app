$(function() {
    var MemberProfileBox = MeiweiApp.View.extend({
    	events: {
            'click .avatar': 'changeAvatar',
            'change #imageUploader': 'changeAvatarHtml5'
        },
    	initView: function() {
            this.listenTo(MeiweiApp.me.profile, 'change', this.updateProfile);
            var self = this;
            document.addEventListener("deviceready", function(e) {
                self.renderAvatar();
            });
        },
        onChangeAvatarSuccess: function(imageData){
            localStorage.setItem('avatar', imageData);
            if(MeiweiApp.isCordova){
                this.$('.avatar img')[0].src = imageData;
            }
            else{
                this.$('.avatar img')[0].src = "javascript:void(0)";
                this.$('.avatar img').css("background-image", "url("+imageData+")");
            }
            var user_id = window.localStorage.getItem('user_id');
            if(user_id){
                new (Backbone.Model.extend({
                    urlRoot : MeiweiApp.configs.APIHost + '/members/profile/'+user_id+'/avatar/'
                }))().save();
            }
        },
        changeAvatarHtml5: function(){
            var reader = new FileReader();
            var self=this
            var files = !!$('#imageUploader').get(0).files ? $('#imageUploader').get(0).files : [];
            reader.readAsDataURL(files[0]);
            reader.onloadend = function(e){
                var imageData = e.target.result;
                self.onChangeAvatarSuccess(imageData);
            }
        },
    	changeAvatar: function() {
    		// function onSuccess(imageData) {
    		// 	localStorage.setItem('avatar', imageData);
    		//  this.$('.avatar img')[0].src = "data:image/jpeg;base64," + imageData;
    		// }
            var self=this; 
    		if (navigator.camera && _.isFunction(navigator.camera.getPicture)) {
        		navigator.camera.getPicture(
        			function(imageData) {
                        self.onChangeAvatarSuccess("data:image/jpeg;base64," + imageData);
                    }, function() {}, {
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
    	renderAvatar: function() {
    	    var imageData = localStorage.getItem('avatar');
            if(imageData){
                if(MeiweiApp.isCordova){
                    $("#imageUploader").remove();
                    this.$('.avatar img')[0].src = imageData;
                }
                else{
                    $('.avatar img')[0].src = "javascript:void(0)";
                    $('.avatar img').css("background-image", "url("+imageData+")");
                }
            }
            else{
                this.$('.avatar img')[0].src = "assets/img/default-avatar@2x.png";
            }
        }
    });
    
    var FavoriteRestoCarousel = MeiweiApp.View.extend({
    	initView: function() {
	        this.listenTo(MeiweiApp.me.favorites, 'reset', this.pickImage);
	    },
        pickImage: function() {
            var favorites = MeiweiApp.me.favorites;
            if (favorites.length > 0) {
                var ran = _.random(0, favorites.length - 1);
                var model = favorites.at(ran);
	            MeiweiApp.loadBgImage(this.$el, model.get('restaurantinfor').frontpic, {
	    			height: 250
	    		});
            } else {
            	this.$el.css('background-image', 'url(assets/img/default.png)');
            }
        }
    });
    
    MeiweiApp.Pages.MemberCenter = new (MeiweiApp.PageView.extend({
    	events: {
    		'click .header-btn-left': 'onClickLeftBtn',
    		'click .header-btn-right': 'onClickRightBtn',
    		'click .edit-profile': 'gotoMyProfile',
    		'click .member-center-nav > li': 'onClickNav',
    		'click .logout-button': 'logout'
    	},
    	onClickLeftBtn: function() { MeiweiApp.goTo('Home'); },
    	onClickRightBtn: function() { MeiweiApp.goTo('Settings'); },
    	gotoMyProfile: function() { MeiweiApp.goTo('MemberProfile'); },
    	onClickNav: function(e) {
    	    var el = e.currentTarget;
    	    MeiweiApp.goTo($(e.currentTarget).attr('data-nav'));
    	},
    	logout: function() {
    		MeiweiApp.me.logout();
    		MeiweiApp.goTo('Home');
    	},
    	initPage: function() {
    		_.bindAll(this, 'askToShare');
    		this.views = {
    			profileBox: new MemberProfileBox({ el: this.$('.member-profile-box') }),
    			favoriteCarousel: new FavoriteRestoCarousel({ el: this.$('.favorite-resto-carousel') })
    		};
    	},
    	askToShare: function(response) {
            window.localStorage.setItem('user_id',response.get('id'));
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
    	    if (!this.rendered) {
    	        this.rendered = true;
    	        MeiweiApp.me.once('logout', function() {
                    this.rendered = false;
                }, this);
    	        MeiweiApp.me.fetch({ success: this.askToShare });
    	        MeiweiApp.me.favorites.fetch({ reset: true });
    	    }
    	}
    }))({el: $("#view-member-center")});
});

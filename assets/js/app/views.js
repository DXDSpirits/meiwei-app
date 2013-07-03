
MeiweiApp.View = Backbone.View.extend({});

MeiweiApp.ModelView = Backbone.View.extend({
	initialize: function() {
		this.model.on('change', this.render, this);
	},
	template: Mustache.compile(""),
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

MeiweiApp.CollectionView = Backbone.View.extend({
	modelView: MeiweiApp.ModelView,
	initialize: function() {
		this.collection.on('reset', this.addAll, this);
		this.collection.on('add', this.addOne, this);
	},
	addOne: function(item) {
		this.$el.append((new this.modelView({model: item})).render().el);
	},
	addAll: function() {
		this.$el.html("");
		this.collection.forEach(this.addOne, this);
	},
	render: function() {
	    this.addAll();
	    return this;
	}
});

MeiweiApp.PageView = Backbone.View.extend({
	views: {},
	slideIn: function() {
		if (this.$el && this.$el.hasClass('view-hidden')) {
			$('.view').addClass('view-hidden');
			this.$el.removeClass('view-hidden');
		}
	},
	show: function() {
		this.render();
		this.slideIn();
	}
});


/********************************** Home **********************************/

MeiweiApp.Views.RecommendListItem = MeiweiApp.ModelView.extend({
	//events: { 'click': 'viewRestaurant' },
	tagName: 'section',
	className: 'recommend-list-item',
	template: MeiweiApp.Templates['recommend-list-item'],
	viewRestaurant: function() {
		var restaurantId = this.model.get('restaurant').id
		MeiweiApp.Router.navigate('restaurant/' + restaurantId, {trigger: true});
	}
});

MeiweiApp.Views.RecommendList = MeiweiApp.CollectionView.extend({
	modelView: MeiweiApp.Views.RecommendListItem
})

MeiweiApp.Pages.Home = new (MeiweiApp.PageView.extend({
	show: function() {
		this.recommends = new MeiweiApp.Collections.Recommends();
		var recommendListView = new MeiweiApp.Views.RecommendList({
			collection: this.recommends,
			el: this.$('.scroll')
		});
		this.recommends.fetch({reset: true});
		this.slideIn();
	}
}))({el: $("#view-home")});


/********************************** Restaurant Search **********************************/


MeiweiApp.Views.RestaurantListItem = MeiweiApp.ModelView.extend({
	events: { 'click': 'viewRestaurant' },
	tagName: 'section',
	className: 'restaurant-list-item',
	template: MeiweiApp.Templates['restaurant-list-item'],
	viewRestaurant: function() {
		MeiweiApp.Router.navigate('restaurant/' + this.model.id, {trigger: true});
	}
});

MeiweiApp.Views.RestaurantList = MeiweiApp.CollectionView.extend({
	modelView: MeiweiApp.Views.RestaurantListItem
})

MeiweiApp.Pages.RestaurantList = new (MeiweiApp.PageView.extend({
	initialize: function() {
		this.collection = new MeiweiApp.Collections.Restaurants();
		this.restaurantListView = new MeiweiApp.Views.RestaurantList({
			collection: this.collection,
			el: this.$('.scroll')
		});
		_.bindAll(this, 'renderRestaurantList');
	},
	renderRestaurantList: function() {
		this.restaurantListView.render();
		this.scroller = new IScroll('#view-restaurant-list .wrapper', {
			scrollX: false, scrollY: true, momentum: true, snap: true, snapStepY: 200
		});
	},
	show: function() {
		this.collection.fetch({
			reset: true,
			success: this.renderRestaurantList 
		});
		this.slideIn();
	}
}))({el: $("#view-restaurant-list")});


/********************************** Restaurant Profile **********************************/


MeiweiApp.Views.RestaurantProfileBox = MeiweiApp.ModelView.extend({
	template: MeiweiApp.Templates['restaurant-profile-box'],
});

MeiweiApp.Views.RestaurantPictureList = MeiweiApp.CollectionView.extend({
	modelView: MeiweiApp.ModelView.extend({
		template: MeiweiApp.Templates['restaurant-picture'],
	})
});

MeiweiApp.Views.RestaurantReviewList = MeiweiApp.CollectionView.extend({
	modelView: MeiweiApp.ModelView.extend({
		template: MeiweiApp.Templates['restaurant-review'],
	})
});

MeiweiApp.Pages.Restaurant = new (MeiweiApp.PageView.extend({
	initialize: function() {
		this.restaurant = new MeiweiApp.Models.Restaurant();
		this.views.restaurantProfileBox = new MeiweiApp.Views.RestaurantProfileBox({
			model: this.restaurant,
			el: this.$('.restaurant-profile')
		});
		this.views.pictures = new MeiweiApp.Views.RestaurantPictureList({
			collection: this.restaurant.pictures,
			el: this.$('.restaurant-pictures')
		});
		this.views.reviews = new MeiweiApp.Views.RestaurantReviewList({
			collection: this.restaurant.reviews,
			el: this.$('.restaurant-reviews')
		});
		_.bindAll(this, 'renderRestaurantProfileBox')
	},
	renderRestaurantProfileBox: function() {
		this.restaurant.pictures.fetch({reset: true});
		this.restaurant.reviews.fetch({reset: true});
	},
	show: function(rid) {
		this.restaurant.set({id: rid});
		this.restaurant.fetch({ success: this.renderRestaurantProfileBox });
		this.slideIn();
	}
}))({el: $("#view-restaurant")});


/********************************** Restaurant Order **********************************/


MeiweiApp.Views.ContactList = MeiweiApp.CollectionView.extend({
	modelView: MeiweiApp.ModelView.extend({
		events: {
			"click": "updateContact"
		},
		template: Mustache.compile("{{name}} - {{mobile}}"),
		initialize: function() {
			this.$el.val(this.model.id);
		},
		updateContact: function(e) {
			var contactId = e.target.value;
			var contact = MeiweiApp.me.contacts.get(contactId);
			contact.trigger("select");
		}
	})
});

MeiweiApp.Views.FloorplanList = MeiweiApp.CollectionView.extend({
	modelView: MeiweiApp.ModelView.extend({
		template: Mustache.compile("{{caption}} - {{path}}"),
		initialize: function() {
			this.$el.attr("id", "floorplan" + this.model.id);
		}
	})
});

MeiweiApp.Views.RestaurantOrderForm = MeiweiApp.View.extend({
	events: {
		'submit': 'submitOrder',
	},
	initialize: function() {
		this.restaurant = this.model;
		this.model = null;
	},
	template: MeiweiApp.Templates['restaurant-order-form'],
	render: function() {
		this.$el.html(this.template(this.restaurant.toJSON()));
	},
	submitOrder: function(e) {
		e.preventDefault();
		var newOrder = new MeiweiApp.Models.Order();
		newOrder.set({
		    'member': MeiweiApp.me.id,
		    'restaurant': this.restaurant.id,
		    'orderdate': this.$('input[name=orderdate]').val(),
		    'ordertime': this.$('input[name=ordertime]').val(),
		    'personnum': this.$('input[name=personnum]').val(),
		    'contactname': this.$('input[name=contactname]').val(),
		    'contactphone': this.$('input[name=contactphone]').val(),
		    'other': this.$('textarea[name=other]').text()
		});
		newOrder.save({}, {error: function(model, xhr, options) {
			var errors = JSON.parse(xhr.responseText);
			console.log("Failed submitting new order. " + xhr.responseText);
		}});
	}
});

MeiweiApp.Pages.RestaurantOrder = new (MeiweiApp.PageView.extend({
	initialize: function() {
		this.restaurant = new MeiweiApp.Models.Restaurant();
		this.restaurantOrderForm = new MeiweiApp.Views.RestaurantOrderForm({
			model: this.restaurant,
			el: this.$('.scroll div:nth-child(1)')
		});
		this.contactListView = new MeiweiApp.Views.ContactList({
			collection: MeiweiApp.me.contacts,
			el: this.$('.scroll div:nth-child(2)')
		});
		this.floorplanListView = new MeiweiApp.Views.FloorplanList({
			collection: this.restaurant.floorplans,
			el: this.$('.scroll div:nth-child(3)')
		});
		_.bindAll(this, "renderOrderForm", "bindContactSelect");
	},
	renderOrderForm: function(model, response, options) {
		this.restaurantOrderForm.render();
		this.restaurant.floorplans.fetch({ reset: true });
		MeiweiApp.me.contacts.fetch({
			reset: true,
			success: this.bindContactSelect
		});
	},
	bindContactSelect: function(collection, response, options) {
		collection.forEach(
			function(contact) {
				contact.on("select", function() {
					this.$('input[name=contactname]').val(contact.get('name'));
					this.$('input[name=contactphone]').val(contact.get('mobile'));
				}, this)
			}, this);
		collection.at(0).trigger("select");
	},
	show: function(rid) {
		this.restaurant.set({id: rid});
		this.restaurant.fetch({ success: this.renderOrderForm });
		this.slideIn();
	}
}))({el: $("#view-restaurant-order")});


/********************************** Member Profile **********************************/


MeiweiApp.Views.MemberProfileForm = MeiweiApp.ModelView.extend({
	template: MeiweiApp.Templates['member-profile-form'],
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
	}
});

MeiweiApp.Pages.MemberProfile = new (MeiweiApp.PageView.extend({
	initialize: function() {
		this.profileView = new MeiweiApp.Views.MemberProfileForm({
			model: MeiweiApp.me.profile,
			el: this.$('.scroll')
		});
		_.bindAll(this, 'renderProfileView')
	},
	renderProfileView: function() {
		this.profileView.render();
	},
	show: function() {
		MeiweiApp.me.profile.fetch({ success: this.renderProfileView });
		this.slideIn();
	}
}))({el: $("#view-member-profile")});


/********************************** Member Login **********************************/


MeiweiApp.Views.MemberLoginForm = MeiweiApp.View.extend({
	events: { 'submit': 'login' },
	login: function(e) {
		e.preventDefault();
		username = this.$('input[name=username]').val();
		password = this.$('input[name=password]').val();
		MeiweiApp.me.login(username, password);
		MeiweiApp.Router.navigate('member/profile', {trigger: true});
	},
	template: MeiweiApp.Templates['member-login-form'],
	render: function() {
		this.$el.html(this.template);
	}
});

MeiweiApp.Views.MemberLogoutForm = MeiweiApp.View.extend({
	events: { 'submit': 'logout' },
	logout: function(e) {
		e.preventDefault();
		MeiweiApp.me.logout();
		MeiweiApp.Router.navigate('home', {trigger: true});
	},
	template: MeiweiApp.Templates['member-logout-form'],
	render: function() {
		this.$el.html(this.template);
	}
});

MeiweiApp.Views.MemberRegisterForm = MeiweiApp.View.extend({
	events: { 'submit': 'register' },
	register: function(e) {
		e.preventDefault();
		email = this.$('input[name=email]').val();
		mobile = this.$('input[name=mobile]').val();
		password = this.$('input[name=password]').val();
		MeiweiApp.me.register(email, mobile, password);
		MeiweiApp.Router.navigate('member/profile', {trigger: true});
	},
	template: MeiweiApp.Templates['member-register-form'],
	render: function() {
		this.$el.html(this.template);
	}
});

MeiweiApp.Pages.MemberLogin = new (MeiweiApp.PageView.extend({
	initialize: function() {
		this.loginForm = new MeiweiApp.Views.MemberLoginForm({ el: this.$('.scroll .login-box') });
		this.logoutForm = new MeiweiApp.Views.MemberLogoutForm({ el: this.$('.scroll .logout-box') });
		this.registerForm = new MeiweiApp.Views.MemberRegisterForm({ el: this.$('.scroll .register-box') });
	},
	show: function() {
		loginForm.render();
		logoutForm.render();
		registerForm.render();
		this.slideIn();
	}
}))({el: $("#view-member-login")});


/********************************** Order List **********************************/


MeiweiApp.Views.OrderList = MeiweiApp.CollectionView.extend({
	modelView: MeiweiApp.ModelView.extend({
		template: MeiweiApp.Templates['order-list-item'],
		events: { 'click': 'viewOrder' },
		viewOrder: function() {
			MeiweiApp.Router.navigate('order/' + this.model.id, {trigger: true});
		}
	})
});

MeiweiApp.Pages.MemberOrders = new (MeiweiApp.PageView.extend({
	initialize: function() {
		this.collection = new MeiweiApp.Collections.Orders();
        this.orderListView = new MeiweiApp.Views.OrderList({
            collection: this.collection,
            el: this.$('.scroll')
        });
	},
    show: function() {
        this.collection.fetch();
        this.slideIn();
    }
}))({el: $("#view-member-orders")});

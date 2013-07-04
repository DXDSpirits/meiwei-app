
MeiweiApp.Views.ContactList = MeiweiApp.CollectionView.extend({
	modelView: MeiweiApp.ModelView.extend({
		events: {
			"click": "updateContact"
		},
		template: Mustache.compile("{{name}} - {{mobile}}"),
		updateContact: function(e) {
			this.model.trigger("select");
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

MeiweiApp.Views.ProductList = MeiweiApp.CollectionView.extend({
	modelView: MeiweiApp.ModelView.extend({
		template: MeiweiApp.Templates['product-box'],
		initialize: function() {
			this.$el.attr("id", "product" + this.model.id);
		},
		render: function() {
			this.$el.html(this.template({
				product: this.model.toJSON(),
				items: this.model.items.toJSON(),
			}));
			return this;
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
		var pending
		if (MeiweiApp.pendingOrder == null) {
			var today = new Date();
			pending = {
				orderdate: today.toJSON().slice(0, 10),
				ordertime: '19:00:00',
				personnum: 2
			}
		} else {
			pending = MeiweiApp.pendingOrder.toJSON()
		}
		this.$el.html(this.template({
			restaurant: this.restaurant.toJSON(),
			order: pending
		}));
	},
	submitOrder: function(e) {
		e.preventDefault();
		var newOrder = new MeiweiApp.Models.Order();
		newOrder.set({
		    member: MeiweiApp.me.id,
		    restaurant: this.restaurant.id,
		    orderdate: this.$('input[name=orderdate]').val(),
		    ordertime: this.$('input[name=ordertime]').val(),
		    personnum: this.$('input[name=personnum]').val(),
		    contactname: this.$('input[name=contactname]').val(),
		    contactphone: this.$('input[name=contactphone]').val(),
		    other: this.$('textarea[name=other]').text()
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
		
		this.products = new MeiweiApp.Collections.Products();
		this.productList = new MeiweiApp.Views.ProductList({
			collection: this.products,
			el: this.$('.scroll div:nth-child(4)')
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
		this.products.fetch({
			data: {category: 1}, 
			trigger: true
		});
		this.slideIn();
	}
}))({el: $("#view-restaurant-order")});

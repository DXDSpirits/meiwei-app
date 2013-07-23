MeiweiApp.Views.ProductCartItemList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		tagName: "div",
		className: "product-cart-item",
		events: { "click .item-delete": "triggerDelete" },
		template: Mustache.compile('<img src="{{ picture }}" alt=""><div class="delete-button">移除</div>'),
		triggerDelete: function(e) { }
	})
});

MeiweiApp.Views.RestaurantOrderForm = MeiweiApp.View.extend({
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
});

MeiweiApp.Pages.RestaurantOrder = new (MeiweiApp.PageView.extend({
	events: {
		'click .contact-info > header': 'selectContact',
		'click .floorplan-select > header': 'selectSeat',
		'click .product-select > header': 'selectProduct',
		'click .order-submit-button': 'submitOrder'
	},
	initPage: function() {
		this.restaurant = new MeiweiApp.Models.Restaurant();
		this.views = {
			orderForm: new MeiweiApp.Views.RestaurantOrderForm({
				model: this.restaurant,
				el: this.$('.order-info')
			}),
			productCart: new MeiweiApp.Views.ProductCartItemList({
				collection: MeiweiApp.ProductCart,//this.productItems,
				el: this.$('.product-cart')
			})
		};
		_.bindAll(this, 'renderOrderForm', 'fillContact');
	},
	onClickLeftBtn: function() { MeiweiApp.Pages.RestaurantDetail.showPage(); },
	selectContact: function() {
		MeiweiApp.Pages.MemberContacts.go({
			multiple: false, 
			caller: this,
			callback: this.fillContact
		});
	},
	fillContact: function(contactname, contactphone) {
		this.$('input[name=contactname]').val(contactname);
		this.$('input[name=contactphone]').val(contactphone);
	},
	selectSeat: function() {
		MeiweiApp.Pages.RestaurantFloorplans.go({
			restaurantId: this.restaurant.id
		});
	},
	selectProduct: function() {
		MeiweiApp.Pages.ProductPurchase.go();
	},
	updateProductCart: function() {
		console.log(MeiweiApp.ProductCart);
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
	},
	renderOrderForm: function(model, response, options) {
		this.$('.restaurant-info img').attr('src', this.restaurant.get('frontpic'));
		this.$('.restaurant-info h1').html(this.restaurant.get('fullname'));
		this.views.orderForm.render();
		this.views.productCart.render();
		this.showPage();
	},
	render: function(options) {
		if (options.restaurant) {
			this.restaurant.set(options.restaurant);
			this.renderOrderForm();
		} else if (options.restaurantId) {
			this.restaurant.set({id: options.restaurantId});
			this.restaurant.fetch({ success: this.renderOrderForm });
		}
		
	}
}))({el: $("#view-restaurant-order")});

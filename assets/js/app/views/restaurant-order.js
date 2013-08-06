MeiweiApp.Views.ProductCartItemList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		tagName: "div",
		className: "product-cart-item",
		events: { "click .delete-button": "triggerDelete" },
		template: MeiweiApp.Templates['product-cart-item'],
		triggerDelete: function() {
			MeiweiApp.ProductCart.remove(this.model);
		}
	})
});

MeiweiApp.Views.RestaurantOrderContactForm = MeiweiApp.View.extend({
	events: {
		'click >header': 'selectContact',
		'click .switch-gender': 'switchGender'
	},
	initialize: function() { _.bindAll(this, 'fillContact'); },
	selectContact: function() {
		MeiweiApp.goTo('MemberContacts', { multiple: false, callback: this.fillContact });
	},
	fillContact: function(contactname, contactphone) {
		this.$('input[name=contactname]').val(contactname);
		this.$('input[name=contactphone]').val(contactphone);
	},
	switchGender: function() {
		var s = this.$('.switch-gender');
		if ($(s).hasClass('on')) {
			$(s).removeClass('on');
			$(s).find('input').val($(s).find('label.text-off').text());
		} else {
			$(s).addClass('on');
			$(s).find('input').val($(s).find('label.text-on').text());
		}
	},
	template: MeiweiApp.Templates['restaurant-order-contact-form'],
	render: function() {
		this.$el.html(this.template());
		return this;
	}
});

MeiweiApp.Views.RestaurantOrderForm = MeiweiApp.View.extend({
	events: {
		'change input[name=orderdate]': 'renderHourList'
	},
	initialize: function() {
		_.bindAll(this, 'renderHourList');
		this.restaurant = this.model;
		this.defaultValues = null;
		this.hours = new MeiweiApp.Models.Hour();
		this.model = null;
	},
	template: MeiweiApp.Templates['restaurant-order-form'],
	renderHourList: function() {
		var date = new Date(this.$('input[name=orderdate]').val());
		var $select = this.$('select[name=ordertime]');
		$select.empty();
		var hour = this.hours.get(date.getDay().toString());
		for (var i=0; i<hour.length; i++) {
			var item = hour[i];
			var $option = $('<option></option>').val(item[0]).html(item[0] + ' ' + item[1]);
			$select.append($option);
		}
		$select.val(this.defaultValues.ordertime);
	},
	render: function() {
		if (MeiweiApp.pendingOrder == null) {
			var today = new Date();
			this.defaultValues = {
				orderdate: today.toJSON().slice(0, 10),
				ordertime: '19:00',
				personnum: 2
			};
		} else {
			this.defaultValues = MeiweiApp.pendingOrder.toJSON();
		}
		this.$el.html(this.template({
			restaurant: this.restaurant.toJSON(),
			order: this.defaultValues
		}));
		this.hours.fetch({url: this.restaurant.get('hours'), async: false});
		this.renderHourList();
	}
});

MeiweiApp.Pages.RestaurantOrder = new (MeiweiApp.PageView.extend({
	onClickLeftBtn: function() {
		MeiweiApp.pendingOrder = null;
		MeiweiApp.goBack();
	},
	events: {
		'click .floorplan-select > header': 'selectSeat',
		'click .product-select > header': 'selectProduct',
		'click .order-submit-button': 'submitOrder',
	},
	initPage: function() {
		_.bindAll(this, 'renderOrderForm');
		this.restaurant = new MeiweiApp.Models.Restaurant();
		this.floorplans = new MeiweiApp.Collections.Floorplans();
		this.views = {
			orderForm: new MeiweiApp.Views.RestaurantOrderForm({
				model: this.restaurant,
				el: this.$('.order-info')
			}),
			orderContactForm: new MeiweiApp.Views.RestaurantOrderContactForm({
				el: this.$('.contact-info')
			}),
			productCart: new MeiweiApp.Views.ProductCartItemList({
				collection: MeiweiApp.ProductCart,
				el: this.$('.product-cart')
			})
		};
	},
	selectSeat: function() {
		this.floorplans.reset(this.restaurant.get('floorplans'));
		this.floorplans.forEach(function(model) {
			model.set("selected", this.options.tables);
			this.listenTo(model, 'selected', function() {
				var tables = arguments[0];
				this.options.tables = JSON.stringify(
					$.extend(($.parseJSON(this.options.tables || null) || {}),
					$.parseJSON(tables))
				) ;
				if(tables && tables.length > 0) {
					this.$(".floorplan-select > header span").text("(已选)");
				}
			});
		} , this);
		MeiweiApp.goTo('RestaurantFloorplans', {
			floorplans: this.floorplans,
		});	
	},
	selectProduct: function() {
		MeiweiApp.goTo('ProductPurchase');
	},
	submitOrder: function(e) {
		e.preventDefault();
		
		var r = confirm("提交订单?")
		if (r == false) return;

		var newOrder = new MeiweiApp.Models.Order();
		var products = _.reduce(MeiweiApp.ProductCart.models, function(products, item){ 
			return products + item.id + ',';
		}, '');
		newOrder.set({
		    member: MeiweiApp.me.id,
		    restaurant: this.restaurant.id,
		    orderdate: this.$('input[name=orderdate]').val(),
		    ordertime: this.$('select[name=ordertime]').val(),
		    personnum: this.$('input[name=personnum]').val(),
		    //contactname: this.$('input[name=contactname]').val() + this.$('input[name=contactgender]').val(),
		    contactname: this.$('input[name=contactname]').val(),
		    contactphone: this.$('input[name=contactphone]').val(),
		    tables: this.options.tables,
		    other: this.$('textarea[name=other]').text(),
		    products: products.slice(0, -1)
		});
		if (MeiweiApp.pendingOrder != null) {
			MeiweiApp.pendingOrder.cancel();
			MeiweiApp.pendingOrder = null;
		}
		var $infoText = this.$('.info-text');
		newOrder.save({}, {
			success: function(model, xhr, options) { MeiweiApp.goTo('OrderList'); },
			error: function(model, xhr, options) {
	            var error = JSON.parse(xhr.responseText);
		        for (var k in error) { $infoText.html(error[k]);  break; };
			}
		});
	},
	renderOrderForm: function(model, response, options) {
		this.$('.restaurant-info img').attr('src', this.restaurant.get('frontpic'));
		this.$('.restaurant-info h1').html(this.restaurant.get('fullname'));
		this.views.orderForm.render();
		this.views.orderContactForm.render();
		this.views.productCart.render();
		this.showPage();
	},
	render: function() {
		if (this.options.restaurant) {
			this.restaurant.set(this.options.restaurant);
			this.renderOrderForm();
		} else if (this.options.restaurantId) {
			this.restaurant.set({id: this.options.restaurantId});
			this.restaurant.fetch({ success: this.renderOrderForm });
		}
	}
}))({el: $("#view-restaurant-order")});

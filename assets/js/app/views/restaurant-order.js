MeiweiApp.Views.ProductCartItemList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		tagName: "div",
		className: "product-cart-item",
		events: { "click .delete-button": "triggerDelete" },
		template: MeiweiApp.Templates['product-cart-item'],
		triggerDelete: function() {
			MeiweiApp.ProductCart.remove(this.model);
			MeiweiApp.Pages.RestaurantOrder.scroller.refresh();
		}
	})
});

MeiweiApp.Views.RestaurantOrderContactForm = MeiweiApp.View.extend({
	initialize: function(options) {
		_.bindAll(this, 'fillContact', 'selectContact', 'switchGender');
		new MBP.fastButton(this.$('>header')[0], this.selectContact);
		new MBP.fastButton(this.$('.switch-gender')[0], this.switchGender);
	},
	selectContact: function() {
		MeiweiApp.goTo('MemberContacts', { multiple: false, callback: this.fillContact });
	},
	fillContact: function(contactname, contactphone) {
		this.$('input[name=contactname]').val(contactname);
		this.$('input[name=contactphone]').val(contactphone);
	},
	switchGender: function() {
		window.scrollTo(0, 0);
		var switchGender = this.$('.switch-gender');
		if (switchGender.hasClass('on')) {
			switchGender.removeClass('on').addClass('off');
			switchGender.find('input').val(0);
			switchGender.find('label').html(switchGender.find('label').attr('data-off'));
		} else {
			switchGender.removeClass('off').addClass('on');
			switchGender.find('input').val(1);
			switchGender.find('label').html(switchGender.find('label').attr('data-on'));
		}
	},
	//template: MeiweiApp.Templates['restaurant-order-contact-form'],
	render: function(defaultValues) {
		this.defaultValues = defaultValues;
		if (defaultValues.contactname) this.$('input[name=contactname]').val(defaultValues.contactname);
		if (defaultValues.contactphone) this.$('input[name=contactphone]').val(defaultValues.contactphone);
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
		this.model = null;
		this.hours = new MeiweiApp.Models.Hour();
	},
	//template: MeiweiApp.Templates['restaurant-order-form'],
	renderHourList: function() {
		try {
			var ymd = this.$('input[name=orderdate]').val().split('-');
			var date = new Date(ymd[0], ymd[1] - 1, ymd[2]);
			var $select = this.$('select[name=ordertime]');
			$select.empty();
			var hour = this.hours.get(date.getDay().toString());
			for (var i=0; i<hour.length; i++) {
				var item = hour[i];
				var $option = $('<option></option>').val(item[0]).html(item[0] + ' ' + item[1]);
				$select.append($option);
			}
			$select.val(this.defaultValues.ordertime);
		} catch (e) {
			MeiweiApp.handleError(e);
		}
	},
	render: function(defaultValues) {
		this.defaultValues = defaultValues;
		this.$('input[name=orderdate]').val(defaultValues.orderdate);
		this.$('input[name=personnum]').val(defaultValues.personnum);
		this.$('input[name=other]').val(defaultValues.other);
		this.hours.fetch({url: this.restaurant.get('hours'), success: this.renderHourList });
	}
});

MeiweiApp.Pages.RestaurantOrder = new (MeiweiApp.PageView.extend({
	initPage: function() {
		_.bindAll(this, 'renderOrderForm', 'submitOrder', 
				'selectSeat', 'selectProduct', 'askToSubmitOrder');
		this.restaurant = new MeiweiApp.Models.Restaurant();
		this.floorplans = new MeiweiApp.Collections.Floorplans();
		this.views = {
			orderForm: new MeiweiApp.Views.RestaurantOrderForm({
				model: this.restaurant,
				el: this.$('.order-info'),
			}),
			orderContactForm: new MeiweiApp.Views.RestaurantOrderContactForm({
				el: this.$('.contact-info'),
			}),
			productCart: new MeiweiApp.Views.ProductCartItemList({
				collection: MeiweiApp.ProductCart,
				el: this.$('.product-cart')
			})
		};
		new MBP.fastButton(this.$('.floorplan-select > header')[0], this.selectSeat);
		new MBP.fastButton(this.$('.product-select > header')[0], this.selectProduct);
		new MBP.fastButton(this.$('.order-submit-button')[0], this.askToSubmitOrder);
	},
	selectSeat: function() {
		this.floorplans.reset(this.restaurant.get('floorplans'));
		this.listenTo(this.floorplans, 'selected', function() {
			var selectedSeats = this.floorplans.selectedSeats;
			if (selectedSeats) {
				this.options.tables = JSON.stringify(
					$.extend(($.parseJSON(this.options.tables || null) || {}),
					$.parseJSON(tables))
				) ;
				if(tables && tables.length > 0) {
					this.$(".floorplan-select > header span").text("(已选)");
				}
			}
		});
		MeiweiApp.goTo('RestaurantFloorplans', {
			floorplans: this.floorplans,
		});	
	},
	selectProduct: function() {
		MeiweiApp.goTo('ProductPurchase');
	},
	askToSubmitOrder: function(e) {
		e.preventDefault();
		var submitOrder = this.submitOrder;
		try {
			var callback = function(button) { if (button == 2) submitOrder(); }
			navigator.notification.confirm('订单被确认以后您会收到一条短信。', callback, '确认订单？', ['取消', '确认']);
		} catch (e) {
			if (confirm("提交订单?") == true) submitOrder();
		}
	},
	submitOrder: function() {
		var newOrder = new MeiweiApp.Models.Order();
		var products = _.reduce(MeiweiApp.ProductCart.models, function(products, item){ 
			return products + item.id + ',';
		}, '');
		newOrder.set({
			member: MeiweiApp.me.id,
			restaurant: this.restaurant.id,
			orderdate: this.$('input[name=orderdate]').val() || null,
			ordertime: this.$('select[name=ordertime]').val() || null,
			personnum: this.$('input[name=personnum]').val() || null,
			contactname: this.$('input[name=contactname]').val() || null,
			contactphone: this.$('input[name=contactphone]').val() || null,
			tables: this.options.tables || null,
			other: this.$('textarea[name=other]').text() || null,
			products: products.slice(0, -1)
		});
		if (this.options.pendingOrder) this.options.pendingOrder.cancel();
		this.$('.info-text').html('');
		var $infoText = this.$('.info-text');
		var $scroll = this.$('.scroll');
		newOrder.save({}, {
			success: function(model, xhr, options) { MeiweiApp.goTo('OrderList'); },
			error: function(model, xhr, options) {
				$scroll.scrollTop(0);
				var error = JSON.parse(xhr.responseText);
				for (var k in error) { $infoText.html(error[k]);  break; }
			}
		});
	},
	renderOrderForm: function(model, response, options) {
		var img = $('<img></img>').attr('src', this.restaurant.get('frontpic'));
		this.$('.restaurant-info').html(img);
		this.$('.bottom-banner').html(img.clone());
		$('<h1></h1>').html(this.restaurant.get('fullname')).appendTo(this.$('.restaurant-info'));
		
		var defaultValues;
		if (this.options.pendingOrder) {
			defaultValues = this.options.pendingOrder.toJSON();
		} else {
			defaultValues = {
				orderdate: (new Date()).toJSON().slice(0, 10),
				ordertime: '19:00',
				personnum: 2
			};
		}
		
		this.views.orderForm.render(defaultValues);
		this.views.orderContactForm.render(defaultValues);
		this.views.productCart.render();
		
		if (_.isEmpty(this.restaurant.get('floorplans'))) {
			this.$('.floorplan-select').addClass('hide');
		} else {
			this.$('.floorplan-select').removeClass('hide');
		}
		this.initScroller();
		this.$('input[name=orderdate]').focus();
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

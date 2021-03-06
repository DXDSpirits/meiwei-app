(function() {
    var VIPCardOrderCreation = MeiweiApp.Model.extend({
        urlRoot: MeiweiApp.configs.APIHost + '/orders/ordervipcard/'
    });
    
	var ConfirmDialog = MeiweiApp.View.extend({
    	className: 'dialog',
    	template: TPL['order-confirm-dialog'],
    	events: {
    		'click .btn-cancel': 'closeDialog',
    		'click .btn-confirm': 'confirm'
    	},
    	closeDialog: function() {
    		this.remove();
    		$('#dialog-overlay').addClass('hidden');
    		this.undelegateEvents();
    	},
    	openDialog: function() {
    		$('body').append(this.el);
    		$('#dialog-overlay').removeClass('hidden');
    		this.delegateEvents();
    	},
    	confirm: function() {
    		MeiweiApp.Pages.RestaurantOrder.submitOrder();
    		this.closeDialog();
    	},
    	render: function() {
    		this.renderTemplate();
    		this.openDialog();
    		return this;
    	}
    });
	
    var ProductCartItemList = MeiweiApp.CollectionView.extend({
        removeOne:function(item){
            item.trigger('newhide');
        },
        ModelView: MeiweiApp.ModelView.extend({
            initModelView:function(){
                this.stopListening(this.model,'hide');
                this.listenTo(this.model,'newhide',this.hide);
            },
            className: 'product-cart-item',
            template: TPL['product-cart-item'],
            events: { 'click': 'triggerDelete' },
            triggerDelete: function() {
                MeiweiApp.ProductCart.remove(this.model);
                this.model.trigger('newhide');
            }
        })
    });
    
    var RestaurantOrderContactForm = MeiweiApp.View.extend({
        events: {
            'click > header': 'selectContact'
        },
        initView: function(options) {
            _.bindAll(this, 'fillContact');
        },
        selectContact: function() {
            MeiweiApp.goTo('MemberContacts', { multiple: false, callback: this.fillContact });
        },
        fillContact: function(contactname, contactphone, contactgender) {
            this.$('input[name=contactname]').val(contactname);
            this.$('input[name=contactphone]').val(contactphone);
            this.$('.switch-gender').switchControl('toggle', contactgender);
        },
        //template: TPL['restaurant-order-contact-form'],
        render: function(defaultValues) {
            this.defaultValues = defaultValues;
            if (defaultValues.contactname)
                this.fillContact(defaultValues.contactname, defaultValues.contactphone, defaultValues.contactgender);
            return this;
        }
    });
    
    var RestaurantOrderForm = MeiweiApp.View.extend({
        events: {
            'change input[name=orderdate]': 'renderHourList'
        },
        initView: function() {
            _.bindAll(this, 'renderHourList');
            this.restaurant = this.model;
            this.model = null;
            this.hours = new MeiweiApp.Models.Hour();
        },
        renderHourList: function() {
            var day = moment(this.$('input[name=orderdate]').val()).day();
            var $select = this.$('select[name=ordertime]');
            $select.empty();
            var hour = this.hours.get(day);
            if (hour && hour.length > 0) {
                for (var i=0; i<hour.length; i++) {
                    var item = hour[i];
                    var $option = $('<option></option>').val(item[0]).html(item[0] + ' ' + item[1]);
                    $select.append($option);
                }
                this.defaultValues.ordertime = hour[0];
            }
            $select.val(this.defaultValues.ordertime);
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
        events: {
            'click .header-btn-left': 'onClickLeftBtn',
            'click .header-btn-right': 'onClickRightBtn',
            'click .floorplan-select > header': 'selectSeat',
            'click .product-select > header': 'selectProduct',
            'click .order-submit-button': 'askToSubmitOrder',
            'click .premium-purchase': 'purchasePremium'
        },
        initPage: function() {
            _.bindAll(this, 'renderOrderForm', 'submitOrder');
            this.restaurant = new MeiweiApp.Models.Restaurant();
            this.views = {
                orderForm: new RestaurantOrderForm({ model: this.restaurant, el: this.$('.order-info') }),
                orderContactForm: new RestaurantOrderContactForm({ el: this.$('.contact-info') }),
                productCart: new ProductCartItemList({ collection: MeiweiApp.ProductCart, el: this.$('.product-cart') })
            };
            this.$('.switch-seat').switchControl();
            this.$('.switch-gender').switchControl();
            this.$('.switch-premium').switchControl();
        },
        onClickLeftBtn: function(){
            MeiweiApp.ProductCart.reset();
            MeiweiApp.goBack(); 
        },
        selectSeat: function() {
            var self = this;
            MeiweiApp.goTo('RestaurantFloorplans', {
                floorplans: this.restaurant.get('floorplans'),
                onSelected: function(selectedSeats) {
                    self.selectedSeats = selectedSeats;
                    if (!_.isEmpty(selectedSeats)) {
                        self.$('span.seat-selected').removeClass('hidden');
                    } else {
                        self.$('span.seat-selected').addClass('hidden');
                    }
                } 
            });
        },
        selectProduct: function() {
            //MeiweiApp.goTo('ProductPurchase');
            MeiweiApp.goTo('ProductList',{status:"order"});
        },
        askToSubmitOrder: function(e) {
            if (e.preventDefault) e.preventDefault();
            var dialog = new ConfirmDialog();
			dialog.remove();
			dialog.render();
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
                clubseattype: this.$('input[name=clubseattype]').val() || null,
                contactname: this.$('input[name=contactname]').val() || null,
                contactgender: this.$('input[name=contactgender]').val() || null,
                contactphone: this.$('input[name=contactphone]').val() || null,
                premium: +this.$('input[name=premium]').val() == 1,
                other: this.$('input[name=other]').val() || null,
                tables: this.selectedSeats || null,
                products: products.slice(0, -1)
            });
            if (this.options.pendingOrder) this.options.pendingOrder.cancel();
            this.$('.info-text').html('');
            var self = this;
            newOrder.save({}, {
                success: function(model, xhr, options) {
                    MeiweiApp.goTo('Attending', { orderId: newOrder.id });
                    MeiweiApp.showConfirmDialog(
                        MeiweiApp._('邀请好友'), MeiweiApp._('是否邀请好友？'),
                        function() {
                            var content = '我预定了' + 
                                moment(newOrder.get('orderdate') + ' ' + newOrder.get('ordertime')).format('LLLL') + 
                                '在' + self.restaurant.get('address') +
                                '的' + self.restaurant.get('fullname') + '。一起来吧！';
                            MeiweiApp.sendWeixinMsg(content);
                            MeiweiApp.sendGaSocial('weixin', 'message', 'invitation');
                        }
                    );
                },
                error: function(model, xhr, options) {
                    self.$('.wrapper').scrollTop(0);
                    self.displayError(self.$('.info-text'), xhr.responseText);
                }
            });
        },
        reset: function() {
            this.$('.wrapper').addClass('rendering');
            this.$('.wrapper').css('background-image', 'none');
        },
        renderOrderForm: function(model, response, options) {
            MeiweiApp.loadBgImage(this.$('.wrapper'), this.restaurant.get('frontpic'), {
    			height: 250
    		});
            //MeiweiApp.loadBgImage($('body'), this.restaurant.get('frontpic'), { height: 250 });
            this.$('.restaurant-name').html(this.restaurant.get('fullname'));
            
            var defaultValues;
            if (this.options.pendingOrder) {
                defaultValues = this.options.pendingOrder.toJSON();
            } else {
                defaultValues = {
                    orderdate: moment().add('days', 1).format('YYYY-MM-DD'),
                    ordertime: '19:00',
                    personnum: 2,
                    clubseattype: 0
                };
            }
            
            var resto_tyle = this.restaurant.get('restaurant_type');
            this.$('.switch-seat .label-off').text(resto_tyle == 20 ? '卡座' : '大厅');
            this.$('.switch-seat').switchControl('toggle', defaultValues.clubseattype);
            
            this.views.orderForm.render(defaultValues);
            this.views.orderContactForm.render(defaultValues);
            this.views.productCart.render();
            this.renderPremiumFlag();
            
            if (_.isEmpty(this.restaurant.get('floorplans'))) {
                this.$('.floorplan-select').addClass('hidden');
            } else {
                this.$('.floorplan-select').removeClass('hidden');
            }
            //this.$('input[name=orderdate]').focus();
            this.$('.wrapper').removeClass('rendering');
        },
        renderPremiumFlag: function() {
            if (this.restaurant.get('premium')) {
                this.$('.premium-flag').removeClass('hidden');
                this.$('.switch-premium').switchControl('toggle', true);
                var coupons = new MeiweiApp.Collections.Coupons();
                var self = this;
                coupons.fetch({
                    success: function(collection) {
                        var count = coupons.premiumCount();
                        self.$('.premium-flag .number').text(count);
                        if (count <= 0) {
                            self.$('.switch-premium').switchControl('toggle', false);
                            self.$('.switch-premium').addClass('hidden');
                            self.$('.premium-purchase').removeClass('hidden');
                        } else {
                            self.$('.switch-premium').switchControl('toggle', true);
                            self.$('.switch-premium').removeClass('hidden');
                            self.$('.premium-purchase').addClass('hidden');
                        }
                    }
                });
            } else {
                this.$('.switch-premium').switchControl('toggle', false);
                this.$('.premium-flag').addClass('hidden');
            }
        },
        purchasePremium: function() {
            var newOrder = new VIPCardOrderCreation({
                member: MeiweiApp.me.id,
                product_id: 183
            });
            newOrder.save({}, {
                success: function(model, xhr, options) {
                    MeiweiApp.goTo('GenericOrderDetail', {orderId: model.id});
                }
            });
        },
        render: function() {
            this.$('.info-text').html('');
            if (this.options.restaurant) {
                this.restaurant.set(this.options.restaurant);
                this.renderOrderForm();
            } else if (this.options.restaurantId) {
                this.restaurant.set({ id: this.options.restaurantId });
                this.restaurant.fetch({ success: this.renderOrderForm });
            }
        }
    }))({el: $("#view-restaurant-order")});
})();

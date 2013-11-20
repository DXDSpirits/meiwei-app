$(function() {
    var ProductCartItemList = MeiweiApp.CollectionView.extend({
        ModelView: MeiweiApp.ModelView.extend({
            className: 'product-cart-item',
            template: MeiweiApp.Templates['product-cart-item'],
            events: { 'tap .delete-button': 'triggerDelete' },
            triggerDelete: function() {
                MeiweiApp.ProductCart.remove(this.model);
                MeiweiApp.Pages.RestaurantOrder.scroller.refresh();
            }
        })
    });
    
    var RestaurantOrderContactForm = MeiweiApp.View.extend({
        events: { 'tap >header h1': 'selectContact' },
        initView: function(options) {
            _.bindAll(this, 'fillContact', 'switchGender');
            var btn = this.bindFastButton(this.$('.switch-gender'), this.switchGender);
            var switchGender = this.$('.switch-gender');
            btn.onTouchMove = function(event) {
                if (Math.abs(event.touches[0].clientY - this.startY) > 10) btn.reset(event);
                if (switchGender.hasClass('on') && event.touches[0].clientX - btn.startX > 10) btn.reset(event);
                if (switchGender.hasClass('off') && event.touches[0].clientX - btn.startX < -10) btn.reset(event);
            };
        },
        selectContact: function() {
            MeiweiApp.goTo('MemberContacts', { multiple: false, callback: this.fillContact });
        },
        fillContact: function(contactname, contactphone, contactgender) {
            this.$('input[name=contactname]').val(contactname);
            this.$('input[name=contactphone]').val(contactphone);
            this.switchGender(contactgender);
        },
        switchGender: function(gender) {
            window.scrollTo(0, 0);
            var switchGender = this.$('.switch-gender');
            var switchOff = function() {
                switchGender.removeClass('on').addClass('off');
                switchGender.find('input').val(0);
                switchGender.find('label').html(MeiweiApp._('Mr.'));
            };
            var switchOn = function() {
                switchGender.removeClass('off').addClass('on');
                switchGender.find('input').val(1);
                switchGender.find('label').html(MeiweiApp._('Ms.'));
            }
            if (gender == 0) {
                switchOff();
            } else if (gender == 1) {
                switchOn();
            } else {
                if (switchGender.hasClass('on')) switchOff(); else switchOn();
            }
        },
        //template: MeiweiApp.Templates['restaurant-order-contact-form'],
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
            var ymd = this.$('input[name=orderdate]').val().split('-');
            var day = (ymd.length == 3 ? (new Date(ymd[0], ymd[1] - 1, ymd[2])).getDay().toString() : '0');
            var $select = this.$('select[name=ordertime]');
            $select.empty();
            var hour = this.hours.get(day);
            if (hour && hour.length > 0) {
                for (var i=0; i<hour.length; i++) {
                    var item = hour[i];
                    var $option = $('<option></option>').val(item[0]).html(item[0] + ' ' + item[1]);
                    $select.append($option);
                }
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
            'fastclick .header-btn-left': 'onClickLeftBtn',
            'fastclick .header-btn-right': 'onClickRightBtn',
            'tap .floorplan-select > header': 'selectSeat',
            'tap .product-select > header': 'selectProduct',
            'tap .order-submit-button': 'askToSubmitOrder',
        },
        initPage: function() {
            _.bindAll(this, 'renderOrderForm', 'submitOrder');
            this.restaurant = new MeiweiApp.Models.Restaurant();
            this.views = {
                orderForm: new RestaurantOrderForm({ model: this.restaurant, el: this.$('.order-info') }),
                orderContactForm: new RestaurantOrderContactForm({ el: this.$('.contact-info') }),
                productCart: new ProductCartItemList({ collection: MeiweiApp.ProductCart, el: this.$('.product-cart') })
            };
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
            MeiweiApp.goTo('ProductPurchase');
        },
        askToSubmitOrder: function(e) {
            if (e.preventDefault) e.preventDefault();
            MeiweiApp.showConfirmDialog(
                MeiweiApp._('Confirm Order'),
                MeiweiApp._('An SMS will be sent to you to inform you the order has been confirmed'),
                this.submitOrder
            );
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
                contactgender: this.$('input[name=contactgender]').val() || null,
                contactphone: this.$('input[name=contactphone]').val() || null,
                tables: this.selectedSeats || null,
                other: this.$('input[name=other]').val() || null,
                products: products.slice(0, -1)
            });
            if (this.options.pendingOrder) this.options.pendingOrder.cancel();
            this.$('.info-text').html('');
            var self = this;
            newOrder.save({}, {
                success: function(model, xhr, options) {
                    MeiweiApp.goTo('OrderList');
                    MeiweiApp.showConfirmDialog(
                        MeiweiApp._('邀请好友'), MeiweiApp._('是否邀请好友？'),
                        function() {
                            var content = '我预定了' + newOrder.get('orderdate').slice(5,7) + '月' + newOrder.get('orderdate').slice(8,10) + '日' + 
                            			  newOrder.get('ordertime') + '在' + 
                            			  self.restaurant.get('address') + '的' +  self.restaurant.get('fullname') + '。一起来吧！';
                            MeiweiApp.sendWeixinMsg(content);
                            MeiweiApp.sendGaSocial('weixin', 'message', 'invitation');
                        }
                    );
                },
                error: function(model, xhr, options) {
                    self.$('.scroll').scrollTop(0);
                    self.displayError(self.$('.info-text'), xhr.responseText);
                }
            });
        },
        reset: function() {
            this.$('.wrapper').addClass('rendering');
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
            //this.$('input[name=orderdate]').focus();
            this.$('.wrapper').removeClass('rendering');
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
});

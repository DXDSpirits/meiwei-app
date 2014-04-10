$(function() {
    var ProductOrderCreation = MeiweiApp.Model.extend({
        urlRoot: MeiweiApp.configs.APIHost + '/orders/orderproduct/'
    });
    
    var OrderContactForm = MeiweiApp.View.extend({
        events: { 'click > header': 'selectContact' },
        initView: function(options) {
            _.bindAll(this, 'fillContact');
            this.$('.switch-gender').switchControl();
        },
        selectContact: function() {
            MeiweiApp.goTo('MemberContacts', { multiple: false, callback: this.fillContact });
        },
        fillContact: function(contactname, contactphone, contactgender) {
            this.$('input[name=name]').val(contactname);
            this.$('input[name=mobile]').val(contactphone);
            this.$('.switch-gender').switchControl('toggle', contactgender);
        }
    });
    
    MeiweiApp.Pages.ProductOrder = new (MeiweiApp.PageView.extend({
        events: {
            'click .header-btn-left': 'onClickLeftBtn',
            'click .header-btn-right': 'onClickRightBtn',
            'click .order-submit-button': 'askToSubmitOrder'
        },
        initPage: function() {
            _.bindAll(this, 'renderOrderForm', 'submitOrder');
            this.productItem = new MeiweiApp.Models.ProductItem();
            this.views = {
                orderContactForm: new OrderContactForm({ el: this.$('.contact-info') }),
            };
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
            var newOrder = new ProductOrderCreation();
            newOrder.set({
                member: MeiweiApp.me.id,
                product_id: this.productItem.id,
                datetime: this.$('input[name=datetime]').val() || null,
                name: this.$('input[name=name]').val() || null,
                gender: this.$('input[name=gender]').val() || null,
                mobile: this.$('input[name=mobile]').val() || null,
                address: this.$('input[name=address]').val() || null,
                comment: this.$('input[name=comment]').val() || null
            });
            this.$('.info-text').html('');
            var self = this;
            newOrder.save({}, {
                success: function(model, xhr, options) {
                    MeiweiApp.goTo('GenericOrderDetail', {orderId: model.id});
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
            MeiweiApp.loadBgImage(this.$('.wrapper'), this.productItem.get('picture'), {
    			height: 250
    		});
    		var infoTemplate = Mustache.compile(
    		    '<h1>{{name}}</h1>{{#price}}<h1><strong>￥{{price}}</strong></h1>{{/price}}<p>{{description}}</p>');
            this.$('.product-info').html(infoTemplate(this.productItem.toJSON()));
            this.$('input[name=datetime]').val(moment().add('days', 1).format('YYYY-MM-DDTHH:mm:ss'));
            this.views.orderContactForm.render();
            this.$('.wrapper').removeClass('rendering');
        },
        render: function() {
            if (this.options.productItem) {
                this.productItem.set(this.options.productItem);
                this.renderOrderForm();
            } else if (this.options.productItemId) {
                this.productItem.set({id: this.options.productItemId});
                this.productItem.fetch({ success: this.renderOrderForm });
            }
        }
    }))({el: $("#view-product-order")});
});

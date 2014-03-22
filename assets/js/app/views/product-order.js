$(function() {
    var ProductOrderCreation = MeiweiApp.Model.extend({
        urlRoot: MeiweiApp.configs.APIHost + '/orders/orderproduct/'
    });
    
	var ConfirmDialog = MeiweiApp.View.extend({
    	className: 'dialog',
    	template: TPL['order-confirm-dialog'],
    	events: {
    		'fastclick .btn-cancel': 'closeDialog',
    		'fastclick .btn-confirm': 'confirm'
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
    		MeiweiApp.Pages.ProductOrder.submitOrder();
    		this.closeDialog();
    	},
    	render: function() {
    		this.renderTemplate();
    		this.openDialog();
    		return this;
    	}
    });
    
    var OrderContactForm = MeiweiApp.View.extend({
        events: { 'fastclick > header': 'selectContact' },
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
            'fastclick .header-btn-left': 'onClickLeftBtn',
            'fastclick .header-btn-right': 'onClickRightBtn',
            'fastclick .order-submit-button': 'askToSubmitOrder'
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
            var dialog = new ConfirmDialog();
			dialog.remove();
			dialog.render();
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
                comment: this.$('input[name=comment]').val() || null
            });
            this.$('.info-text').html('');
            var self = this;
            newOrder.save({}, {
                success: function(model, xhr, options) {
                    MeiweiApp.goTo('Attending', { orderId: newOrder.id });
                },
                error: function(model, xhr, options) {
                    self.$('.wrapper').scrollTop(0);
                    self.displayError(self.$('.info-text'), xhr.responseText);
                }
            });
        },
        reset: function() {
            this.$('.wrapper').addClass('rendering');
            this.$('.product-picture').css('background-image', 'none');
        },
        renderOrderForm: function(model, response, options) {
            MeiweiApp.loadBgImage(this.$('.product-picture'), this.productItem.get('picture'), {
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

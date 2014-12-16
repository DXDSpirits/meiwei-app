(function() {
    var ProductOrderCreation = MeiweiApp.Model.extend({
        urlRoot: MeiweiApp.configs.APIHost + '/orders/orderproduct/'
    });
    
    var OrderContactForm = MeiweiApp.View.extend({
        events: {
            'click > header': 'selectContact'
        },
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
    
    MeiweiApp.Pages.PackageOrderConfirm = new (MeiweiApp.PageView.extend({
        events: {
            'click .header-btn-left': 'onClickLeftBtn',
            'click .header-btn-right': 'onClickRightBtn',
            'click .btn-submit': 'submitOrder'
        },
        initPage: function() {
            this.views = {
                senderForm: new OrderContactForm({ el: this.$('.contact-info.sender') }),
                receiverForm: new OrderContactForm({ el: this.$('.contact-info.receiver') }),
            };
        },
        submitOrder: function() {
            var name = this.$('.receiver input[name=name]').val() || null;
            var gender = this.$('.receiver input[name=gender]').val() || null;
            var mobile = this.$('.receiver input[name=mobile]').val() || null;
            var address = this.$('.receiver input[name=address]').val() || null;
            var sender_name = this.$('.sender input[name=name]').val() || null;
            var sender_gender = this.$('.sender input[name=gender]').val() || null;
            var sender_mobile = this.$('.sender input[name=mobile]').val() || null;
            var sender_address = this.$('.sender input[name=address]').val() || null;
            var comment = this.$('input[name=wish]').val() || null;
            this.order.set({
                name: name,
                gender: gender,
                mobile: mobile,
                address: address,
                sender_name: sender_name,
                sender_gender: sender_gender,
                sender_mobile: sender_mobile,
                sender_address: sender_address,
                comment: comment
            });
            this.$('.info-text').html('');
            if (!name || !mobile || !address || !sender_name || !sender_mobile || !sender_address) {
                MeiweiApp.showAlertDialog('请完善收件人和寄件人信息');
            } else {
                this.order.save({}, {
                    success: function(model, xhr, options) {
                        MeiweiApp.goTo('PackageOrderDetail');
                    }
                });
            }
        },
        render: function() {
            this.$('.info-text').html('');
            if (this.options.order) {
                this.order = this.options.order;
            } else {
                MeiweiApp.goBack();
            }
        }
    }))({el: $("#view-package-order-confirm")});
})();

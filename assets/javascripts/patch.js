(function() {
    window.PATCH = true;
    
    $('#view-package-order-confirm input[name=address]').attr('type', 'text');
    
    MeiweiApp.Pages.PackageOrderDetail.checkPayment = function() {};
    
    MeiweiApp.Pages.PackageOrderConfirm.submitOrder = function() {
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
    };
    MeiweiApp.Pages.PackageOrderConfirm.undelegateEvents();
    MeiweiApp.Pages.PackageOrderConfirm.delegateEvents();
    
})();

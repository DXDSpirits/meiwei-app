$(function() {
    var AirportOrderCreation = MeiweiApp.Model.extend({
        urlRoot: MeiweiApp.configs.APIHost + '/orders/orderairport/'
    });
    
    var ConfirmDialog = MeiweiApp.View.extend({
        className: 'dialog',
        template: TPL['orderdriver-confirm-dialog'],
        events: {
            'click .btn-cancel': 'cancel',
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
        cancel: function() {
            this.closeDialog();
            MeiweiApp.goTo('Home');
        },
        confirm: function() {
            this.closeDialog();
        },
        render: function() {
            this.renderTemplate();
            this.openDialog();
            return this;
        }
    });
    
    var GuestLists = MeiweiApp.CollectionView.extend({
        ModelView: MeiweiApp.ModelView.extend({
            template: Mustache.compile(
                '<span>{{name}}{{#gender}}女士{{/gender}}{{^gender}}先生{{/gender}}, {{id_no}}</span>' +
                '<a class="remove">删除</a>'),
            tagName: 'p',
            className: 'control-group text-right',
            events: { 'click .remove': 'removeGuest' },
            removeGuest: function () {
                this.model.destroy();
            }
        })
    });
    
    MeiweiApp.Pages.VVIP = new (MeiweiApp.PageView.extend({
        events: {
            'click .header-btn-left': 'onClickLeftBtn',
            'click .add-client-button': 'addClient',
            'click .order-submit-button': 'submitOrder',
            'click .contact-menu': 'selectContact',
            'click .service-type': 'switchService',
            'click .info-desc': 'jumpDescription',
            'change input[name=datetime]':'checkTime',
            'blur input[name=accompany]':'checkAccompany'
        },
        initPage: function() {
            _.bindAll(this, 'fillContact');
            this.guests = new MeiweiApp.Collection();
            this.views = {
                guestList: new GuestLists({ collection: this.guests, el: this.$('.guest-list') })
            };
            this.$('.switch-gender').switchControl();
        },
        jumpDescription: function(){
        	//link 设计
        	MeiweiApp.openWindow('http://www.clubmeiwei.com/aboutus/vvip');
        },
        switchService: function(e) {
            var $el = $(e.target);
            var service_type = $el.data('type');
            $el.addClass('selected').siblings().removeClass('selected');
            this.$('input[name=service_type]').val(service_type);
            this.$('.service-detail').attr('class', 'service-detail ' + service_type);
        },
        addClient: function (e) {
            if (e && e.preventDefault) e.preventDefault();
            var name = this.$('input[name=guest_name]').val() || null;
            var id_no = this.$('input[name=guest_id_no]').val() || null;
            var gender = +this.$('input[name=guest_gender]').val() || 0;
            if (name && id_no) {
                this.guests.add(new MeiweiApp.Model({
                    name: name, id_no: id_no, gender: gender
                }));
            }
            this.$('input[name=guest_name],input[name=guest_id_no]').val('');
        },
        calculateAmount: function () {
            var amount = 800;
            var airportArray = ['PVG', 'SHA', 'PEK', 'CAN'];
            if (_.contains(airportArray,this.order.get('airport'))) {
                amount = 1500;
            }
            var delta = Math.round((new Date(this.order.get('datetime')) - new Date()) / 1000);
            if (delta < 3 * 60 * 60) {
                amount *= 2;
            }
            var guests = this.order.get('guests').length;
            var accompany = this.order.get('accompany') || 0;
            amount = amount * guests + accompany * 500;
            return amount;
        },
        checkTime: function(){
        	var time=this.$('input[name=datetime]').val() || null;
        	if(time==null)return;
            var delta = Math.round((new Date(time) - new Date()) / 1000);
            if (delta < 3 * 60 * 60) {
                alert('离起飞时间小于3小时,将会导致费用加倍');
            }
        },
        checkAccompany: function(){
        	var accompany=this.$('input[name=accompany]').val() || null;
        	if(parseInt(accompany)>2){
        		this.$('input[name=accompany]').val('');
        		alert('陪同人数最多为2人');
	        }
        },
        submitOrder: function(e) {
            if (e.preventDefault) e.preventDefault();
            if (this.guests.length == 0) this.addClient();
            var fields = {}, inputFields = ['name','mobile', 'gender', 'flight_no', 'car_no',
                'service_type', 'datetime', 'airport', 'accompany', 'address', 'comment'];
            for (var i = 0; i < inputFields.length; i++) {
                var name = inputFields[i];
                fields[name] = this.$('[name=' + name + ']').val() || null;
            }
            fields.accompany = +fields.accompany;
            fields.guests = this.guests.toJSON();
            this.order = new AirportOrderCreation(fields);
            var amount = this.calculateAmount();
            this.$('.hint').remove();
            var self = this;
            MeiweiApp.showConfirmDialog(
                '确认订单', 
                '您需要支付' + amount + '元',
                function () {
                    self.order.save({}, {
                        success: function() {
                            MeiweiApp.goTo('GenericOrderList');
                        },
                        error: function(model, xhr, options) {
                            self.$('.wrapper').scrollTop(0);
                            self.displayErrorBetter(self.$('form'), xhr.responseText);
                        }
                    });
                }
            );
        },
        selectContact: function() {
            MeiweiApp.goTo('MemberContacts', { multiple: false, callback: this.fillContact });
        },
        fillContact: function(contactname, contactphone, contactgender) {
            this.$('input[name=name]').val(contactname);
            this.$('input[name=mobile]').val(contactphone);
            this.$('.switch-gender').switchControl('toggle', contactgender);
        },
        render: function() {
            this.$('.info-text').empty();
            this.$('[name].error').empty();
            this.$('input[name=datetime]').val(moment().add('days', 3).format('YYYY-MM-DDThh:mm:00'));
            this.$('.hint').remove();
        }
    }))({el: $("#view-vvip")});
});

$(function() {
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
    
    MeiweiApp.Pages.RequestDriver = new (MeiweiApp.PageView.extend({
        events: {
            'click .header-btn-left': 'onClickLeftBtn',
            'click .order-submit-button': 'submitOrder',
            'click .asap': 'switchTime',
            'click .contact-menu': 'selectContact'
        },
        initPage: function() {
            _.bindAll(this, 'initializeMap', 'updateAddress', 'fillContact');
            this.views = {  };
            this.$('.switch-gender').switchControl();
        },
        hideMap: function() {
            if (this.map) this.map.clearMap();
        },
        showMap: function() {
            if (!this.map) this.initializeMap();
        },
        switchTime: function() {
            var asap = this.$('.asap');
            var timeInput = this.$('input[name=request_time]');
            if (asap.hasClass('checked')) {
                asap.removeClass('checked');
                timeInput.removeAttr('disabled');
            } else {
                asap.addClass('checked');
                timeInput.attr('disabled', 'disabled');
            }
        },
        initializeMap: function () {
            if (!window.AMap) {
                window.initializeMap = this.initializeMap;
                $.getScript("http://webapi.amap.com/maps?v=1.2&key=88079b446671c954e1de335141228c28&callback=initializeMap");
                return;
            }
            var mapObj = this.map = new AMap.Map('driver_map_canvas', {
                center: new AMap.LngLat(MeiweiApp.coords.longitude, MeiweiApp.coords.latitude),
                continuousZoomEnable: true, level: 18, touchZoom: true
            });
            mapObj.plugin(["AMap.ToolBar"], function() {
                mapObj.toolBar = new AMap.ToolBar();
                mapObj.addControl(mapObj.toolBar);
                mapObj.toolBar.hide();
                mapObj.toolBar.doLocation();
            });
            var updateAddress = this.updateAddress, $addressInput = this.$('input[name=address]');
            mapObj.plugin(["AMap.Geocoder"], function() {
                mapObj.geoCoder = new AMap.Geocoder({ radius: 100, extensions: "base" });
                AMap.event.addListener(mapObj.geoCoder, "complete", updateAddress);
                mapObj.geoCoder.getAddress(new AMap.LngLat(MeiweiApp.coords.longitude, MeiweiApp.coords.latitude));
                AMap.event.addListener(mapObj, 'click', function(e) {
                    mapObj.geoCoder.getAddress(e.lnglat);
                    mapObj.clearMap();
                    new AMap.Marker({ map: mapObj, position: e.lnglat,
                        icon: new AMap.Icon({ size: new AMap.Size(25, 25), image: "assets/images/mapmarker.png" })
                    });
                });
                $addressInput.on('change', function() {
                    mapObj.geoCoder.getLocation($(this).val());
                });
            });
        },
        updateAddress: function(data) {
            if (data.regeocode) {
                this.$('input[name=address]').val(data.regeocode.formattedAddress);
            } else if (data.geocodes && data.geocodes.length) {
                var location = data.geocodes[0].location;
                this.$('input[name=longitude]').val(location.getLng());
                this.$('input[name=latitude]').val(location.getLat());
            }
        },
        submitOrder: function(e) {
            if (e.preventDefault) e.preventDefault();
            var newOrder = new MeiweiApp.Models.OrderDriver();
            newOrder.set({
                address: this.$('input[name=address]').val() || null,
                latitude: +this.$('input[name=latitude]').val() || MeiweiApp.coords.longitude,
                longitude: +this.$('input[name=longitude]').val() || MeiweiApp.coords.latitude,
                name: this.$('input[name=name]').val() || null,
                gender: +this.$('input[name=gender]').val() || 0,
                mobile: this.$('input[name=mobile]').val() || null,
                comment: this.$('input[name=comment]').val() || null,
                request_time: this.$('.asap').hasClass('checked') ? null : this.$('input[name=request_time]').val()
            });
            this.$('.info-text').html('');
            var self = this;
            newOrder.save({}, {
                success: function() {
                    var dialog = new ConfirmDialog();
                    dialog.remove();
                    dialog.render();
                },
                error: function(model, xhr, options) {
                    self.displayErrorBetter(self.$('form'), xhr.responseText);
                }
            });
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
            this.$('.info-text').html('');
            this.$('input[name=ordertime]')
            this.showMap();
        }
    }))({el: $("#view-request-driver")});
});

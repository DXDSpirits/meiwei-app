$(function() {
    MeiweiApp.Pages.RequestDriver = new (MeiweiApp.PageView.extend({
        initPage: function() {
            _.bindAll(this, 'initializeMap', 'updateAddress');
            this.views = {  };
        },
        hideMap: function() {
            if (this.map) this.map.clearMap();
        },
        showMap: function() {
            this.initializeMap();
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
            var updateAddress = this.updateAddress;
            mapObj.plugin(["AMap.Geocoder"], function() {          
                mapObj.geoCoder = new AMap.Geocoder({
                    radius: 100,
                    extensions: "base"
                });
                AMap.event.addListener(mapObj, 'click', function(e) {
                    mapObj.geoCoder.getAddress(e.lnglat);
                    mapObj.clearMap();
                    new AMap.Marker({ map: mapObj, position: e.lnglat,
                        icon: new AMap.Icon({ size: new AMap.Size(25, 25), image: "assets/img/mapmarker.png" })
                    });
                    MeiweiApp.coords.longitude = e.lnglat.getLng();
                    MeiweiApp.coords.latitude = e.lnglat.getLat();
                });
                AMap.event.addListener(mapObj.geoCoder, "complete", updateAddress);
            });
        },
        updateAddress: function(data) {
            this.$('input[name=address]').val(data.regeocode.formattedAddress);
        },
        render: function() {
            this.showMap();
        }
    }))({el: $("#view-request-driver")});
});

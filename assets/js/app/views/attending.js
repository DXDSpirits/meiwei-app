
MeiweiApp.Views.OrderPages = MeiweiApp.CollectionView.extend({
    ModelView: MeiweiApp.ModelView.extend({
        events: {
            'tap .btn-share-weixin': 'onClickWeixinBtn',
            'tap .btn-share-weibo': 'onClickWeiboBtn'
        },
        template: MeiweiApp.Templates['order-attending'],
        className: 'order-page-item carousel-item',
        getWeiboLink : function(s, d, e, r, l, p, t, z, c) {
            var f = 'http://v.t.sina.com.cn/share/share.php?appkey=', u = z || d.location,
            p = ['&url=', e(u), '&title=', e(t || d.title), '&source=', e(r), '&sourceUrl=', e(l), 
                '&content=', c || 'gb2312', '&pic=', e(p || ''), '&ralateUid=', '3058840707'].join('');
            return [f, p].join('');
        },
        onClickWeiboBtn : function() {
              var restaurantinfor = this.model.get('restaurantinfor');
              var content  = '我在 #' + restaurantinfor.fullname + ' (' + restaurantinfor.address + ') ';
             var pic =  this.model.get('restaurantinfor').frontpic;
             var link = this.getWeiboLink(screen, document, encodeURIComponent, 'http://www.clubmeiwei.com', 'http://www.clubmeiwei.com', 
                                         pic, content, 'http://www.clubmeiwei.com/restaurant/view/' + this.model.get('restaurant'), 'utf-8');
             var ref = window.open( link ,'_blank', 'location=no');
        },
        onClickWeixinBtn: function() {
            var restaurantinfor = this.model.get('restaurantinfor');
            var id = restaurantinfor.id;
              var content  = '我在' + restaurantinfor.fullname + '(' + restaurantinfor.address + ')';
             var pic =  this.model.get('restaurantinfor').frontpic;
            var command = [id, content, content, pic];
            var success = function() {};
            var fail = function() {};
            if (window.Cordova) {
                Cordova.exec(success, fail, "Weixin", "sendAppContent", command);
            }
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            if ($('body').height() >= 530) {
                this.$('.section-qrcode').show();
                this.$('.section-qrcode').qrcode({
                    render: "canvas", text: this.model.get('orderno'), height: 100, width: 100
                });
                this.$('.order-detail').css({ 'position': 'relative', 'top': '-50px' });
            }
            return this;
        }
    })
});

MeiweiApp.Pages.Attending = new (MeiweiApp.PageView.extend({
    events: {
        'fastclick .header-btn-left': 'onClickLeftBtn',
        'fastclick .hint-text button': 'goAndBook',
    },
    onClickLeftBtn: function() { MeiweiApp.goTo('Home'); },
    initPage: function() {
        this.orders = new MeiweiApp.Collections.Orders();
        this.views = {
            orderPages: new MeiweiApp.Views.OrderPages({
                collection: this.orders,
                el: this.$('.carousel-inner')
            })
        };
        _.bindAll(this, 'renderPages');
    },
    goAndBook: function() {
        MeiweiApp.goTo('RestaurantSearch');
    },
    renderPages: function() {
        if (this.orders.length == 0) {
            this.$('.viewport').addClass('hidden');
            this.$('.hint-text').removeClass('hidden');
        } else {
            this.$('.viewport').removeClass('hidden');
            this.$('.hint-text').addClass('hidden');
            var items = this.$('.carousel > .carousel-inner > .carousel-item');
            this.$('.carousel > .carousel-inner').css('width', items.length * $(items[0]).outerWidth());
            if (this.scroller == null) {
                if (this.$('.carousel').length > 0) {
                    this.scroller = new IScroll(this.$('.carousel').selector, {
                        scrollX: true, scrollY: false, momentum: false, snap: true, tap: true
                    });
                }
            } else {
                this.scroller.refresh();
            }
        }
    },
    render: function() {
        this.orders.fetch({ reset: true, data: { status: 'pending' }, success: this.renderPages });
    }
}))({el: $("#view-attending")});

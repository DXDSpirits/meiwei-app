$(function() {
    MeiweiApp.Views.OrderPages = MeiweiApp.CollectionView.extend({
        ModelView: MeiweiApp.ModelView.extend({
            events: {
                'click': 'goToOrderDetail',
                'click .btn-share-weixin': 'onClickWeixinBtn',
                'click .btn-share-weibo': 'onClickWeiboBtn'
            },
            template: TPL['order-attending'],
            className: 'order-page-item carousel-item',
            goToOrderDetail: function() {
                MeiweiApp.goTo('OrderDetail', { order: this.model.toJSON() });
            },
            getWeiboLink : function(s, d, e, r, l, p, t, z, c) {
                var f = 'http://v.t.sina.com.cn/share/share.php?appkey=', u = z || d.location,
                p = ['&url=', e(u), '&title=', e(t || d.title), '&source=', e(r), '&sourceUrl=', e(l), 
                    '&content=', c || 'gb2312', '&pic=', e(p || ''), '&ralateUid=', '3058840707'].join('');
                return [f, p].join('');
            },
            onClickWeiboBtn : function(e) {
                if (e.stopPropagation) e.stopPropagation();
                var restaurantinfor = this.model.get('restaurantinfor');
                var url = 'http://www.clubmeiwei.com/restaurant/view/' + this.model.get('restaurant');
                var content  = '我在 #' + restaurantinfor.fullname + '，有神马推荐菜？ 地址：' + restaurantinfor.address;
                var pic =  this.model.get('restaurantinfor').frontpic;
                var link = this.getWeiboLink(screen, document, encodeURIComponent, 
                                             'http://www.clubmeiwei.com', 'http://www.clubmeiwei.com', 
                                             pic, content, url, 'utf-8');
                var ref = MeiweiApp.openWindow(link);
            },
            onClickWeixinBtn: function(e) {
                if (e.stopPropagation) e.stopPropagation();
                var restaurantinfor = this.model.get('restaurantinfor');
                var url = 'http://www.clubmeiwei.com/restaurant/view/' + this.model.get('restaurant');
                var content  = '我在' + restaurantinfor.fullname + '，有神马推荐菜？ 地址' + restaurantinfor.address;
                var pic =  this.model.get('restaurantinfor').frontpic;
                MeiweiApp.shareToMoments(url, content, pic);
            },
            render: function() {
                MeiweiApp.ModelView.prototype.render.call(this);
	            MeiweiApp.loadBgImage(this.$('.section-header-img'), this.model.get('restaurantinfor').frontpic, {
	    			height: 150, width: 250
	    		});
                if ($(window).height() >= 530) {
                    this.$('.section-qrcode').show();
                    this.$('.section-qrcode').qrcode({
                        render: "canvas", text: this.model.get('order_no'), height: 100, width: 100
                    });
                    this.$('.order-detail').css({ 'position': 'relative', 'top': '-50px' });
                }
                return this;
            }
        })
    });
    
    MeiweiApp.Pages.Attending = new (MeiweiApp.PageView.extend({
        events: {
            'click .header-btn-left': 'onClickLeftBtn',
            'click .hint-text button': 'goAndBook',
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
                var items = this.$('.carousel-item'), itemWidth = $(items[0]).outerWidth(),
                    wrapperWidth = this.$('.carousel').innerWidth(),
                    margin = (wrapperWidth - itemWidth) / 2;
                this.$('.carousel-inner').css({
                    'width': items.length * itemWidth + 2 * margin,
                    'padding-left': margin,
                    'padding-right': margin
                });
                if (this.options.orderId) {
                    var index = this.orders.indexOf(this.orders.findWhere({id: this.options.orderId}));
                    this.$('.carousel').animate({ scrollLeft: index * 250 }, 500);
                }
            }
        },
        render: function() {
            this.orders.fetch({
                reset: true,
                data: { status: 'pending' },
                success: this.renderPages
            });
        }
    }))({el: $("#view-attending")});
});

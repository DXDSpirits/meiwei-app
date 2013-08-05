
MeiweiApp.Views.OrderPages = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		events: {'click button.btn-share' : 'onClickShareBtn' },
		template: MeiweiApp.Templates['order-attending'],
		className: 'order-page-item carousel-item',
		getWeiboLink : function(s, d, e, r, l, p, t, z, c) {
		    var f = 'http://v.t.sina.com.cn/share/share.php?appkey=',
		    u = z || d.location,
		    p = ['&url=', e(u), '&title=', e(t || d.title), '&source=', e(r), '&sourceUrl=', e(l), '&content=', c || 'gb2312', '&pic=', e(p || '')].join('');
		    return [f, p].join('');
		},
		onClickShareBtn : function(){
 	 		var content = this.model.get('restaurantinfor').fullname;
	 		if(content && content.length>120){
	 			content = content.substring(0,120);
	 		}
	 		var pic =  this.model.get('restaurantinfor').frontpic;
	 		var link = this.getWeiboLink(screen, document, encodeURIComponent, '', '', 
	 		pic, content, '', 'utf-8');
	 		var ref = window.open( link ,'_blank', 'location=no');
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.$('.section-qrcode').qrcode({
				render	: "canvas",
				text	: this.model.get('orderno'),
				height: 130,
				width:  130
			});	
			return this;
		}
	})
});

MeiweiApp.Pages.Attending = new (MeiweiApp.PageView.extend({
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
	renderPages: function() {
		var items = this.$('.carousel > .carousel-inner > .carousel-item');
		this.$('.carousel > .carousel-inner').css('width', items.length * $(items[0]).outerWidth());
		if (this.scroller == null) {
			this.scroller = new IScroll(this.$('.carousel').selector, {
				scrollX: true,
				scrollY: false,
				momentum: false,
				snap: true,
				snapSpeed: 400,
				preventDefault: false
			});
		} else {
			this.scroller.refresh();
		}
	},
    render: function() {
        $.when(
        	this.orders.fetch({
        		reset: true,
        		success: this.renderPages
        	})
        ).then(this.showPage);
    }
}))({el: $("#view-attending")});

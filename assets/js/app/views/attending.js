
MeiweiApp.Views.OrderPages = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		template: MeiweiApp.Templates['order-attending'],
		className: 'order-page-item carousel-item'
	})
});

MeiweiApp.Pages.Attending = new (MeiweiApp.PageView.extend({
	events: {'click button.btn-share' : 'onClickShareBtn' },
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
		new IScroll(this.$('.carousel').selector, {
			scrollX: true,
			scrollY: false,
			momentum: false,
			snap: true,
			snapSpeed: 400,
			preventDefault: false
		});
	},
	getWeiboLink : function(s, d, e, r, l, p, t, z, c) {
	    var f = 'http://v.t.sina.com.cn/share/share.php?appkey=',
	    u = z || d.location,
	    p = ['&url=', e(u), '&title=', e(t || d.title), '&source=', e(r), '&sourceUrl=', e(l), '&content=', c || 'gb2312', '&pic=', e(p || '')].join('');
	    // function a() {
	        // if (window.open([f, p].join(''), 'mb', ['toolbar=1,status=0,resizable=1,width=440,height=430,left=', (s.width - 440) / 2, ',top=', (s.height - 430) / 2].join(''))) u.href = [f, p].join('');
	    // };
	    return [f, p].join('');
	},
	onClickShareBtn : function(e){
		var div = $(e.target).parent();
 		var content = $(".full-name",div).val()+$(".description",div).val();
 		if(content && content.length>120){
 			content = content.substring(0,120);
 		}
 		var pic = $(".frontpic",div).val();
 		
 		var link = this.getWeiboLink(screen, document, encodeURIComponent, '', '', 
 		pic, content, '', 'utf-8');
 
 		var ref = window.open( link ,'_blank', 'location=no');
		
 		//ref.addEventListener('loadstop', function() {
 			
      	// });
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

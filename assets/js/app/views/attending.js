
MeiweiApp.Views.OrderPages = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		template: MeiweiApp.Templates['order-attending'],
		className: 'order-page-item carousel-item',
	})
});

MeiweiApp.Pages.Attending = new (MeiweiApp.PageView.extend({
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
	onClickLeftBtn: function() { MeiweiApp.Pages.Home.go(); },
	onClickRightBtn: function() { },
	renderPages: function() {
		var items = this.$('.carousel > .carousel-inner > .carousel-item');
		this.$('.carousel > .carousel-inner').css('width', items.length * $(items[0]).outerWidth());
		new IScroll(this.$('.carousel').selector, {
			scrollX: true,
			scrollY: false,
			momentum: false,
			snap: true,
			snapSpeed: 400
		});
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

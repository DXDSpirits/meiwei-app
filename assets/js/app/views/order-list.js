
MeiweiApp.Views.OrderList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		template: MeiweiApp.Templates['order-list-item'],
		events: { 'click': 'viewOrder' },
		className: 'order-list-item',
		viewOrder: function() {
			MeiweiApp.goTo('OrderDetail', {
				order: this.model.toJSON()
			});
		}
	})
});

MeiweiApp.Pages.OrderList = new (MeiweiApp.PageView.extend({
	onClickLeftBtn: function() { MeiweiApp.goTo('MemberCenter'); },
	events: {
		'click .filter-pending': 'getPendingOrders',
		'click .filter-fulfilled': 'getFulfilledOrders'
	},
	initPage: function() {
		_.bindAll(this, 'refreshList', 'fetchPrev', 'fetchNext');
		new MBP.fastButton(this.$('.page-prev')[0], this.fetchPrev);
		new MBP.fastButton(this.$('.page-next')[0], this.fetchNext);
		this.orders = new MeiweiApp.Collections.Orders();
		this.views = {
			orderList: new MeiweiApp.Views.OrderList({
				collection: this.orders,
				el: this.$('.order-list')
			})
		}
	},
	getPendingOrders: function() {
		this.$('.filter-fulfilled').removeClass('selected');
		this.$('.filter-pending').addClass('selected');
		this.orders.fetch({
			reset : true,
			data : { status : 'pending' },
			success: this.refreshList
		});
	},
	getFulfilledOrders: function() {
		this.$('.filter-fulfilled').addClass('selected');
		this.$('.filter-pending').removeClass('selected');
		this.orders.fetch({
			reset: true,
			data: { status: 'fulfilled' },
			success: this.refreshList
		});
	},
	fetchNext: function() {
		this.scroller.scrollTo(0, 0, 360);
		var self = this;
		setTimeout(function() { self.orders.fetchNext({ success: self.refreshList }); }, 360);
	},
	fetchPrev: function() {
		this.scroller.scrollTo(0, 0, 360);
		var self = this;
		setTimeout(function() { self.orders.fetchPrev({ success: self.refreshList }); }, 360);
	},
	refreshList: function() {
		this.$('.page-next').toggleClass('hide', (this.orders.next == null));
		this.$('.page-prev').toggleClass('hide', (this.orders.previous == null));
		this.initScroller();
	},
	render: function() {
		this.showPage();
		this.getPendingOrders();
	}
}))({el: $("#view-order-list")});

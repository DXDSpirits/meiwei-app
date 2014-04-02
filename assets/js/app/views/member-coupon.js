$(function() {
    MeiweiApp.Views.CouponList = MeiweiApp.CollectionView.extend({
    	ModelView: MeiweiApp.ModelView.extend({
    		template: TPL['coupon-list-item'],
    		className: 'restaurant-list-item',
    		events: {
    			'click': 'viewCoupon',
    		},
    		viewCoupon: function() {
    			var link=MeiweiApp.configs.APIHost+"/orders/coupon/"+this.model.get("coupon_no")+"/highlight/";
    			window.open(link, '_blank', 'location=no');
    		},
    		render: function() {
    			MeiweiApp.ModelView.prototype.render.call(this);
    			// if (this.model && this.model.get('detail') && this.model.get('detail').status==0) {
    			// 	// MeiweiApp.loadBgImage(this.$('.thumbnail'), this.model.get('restaurantinfor').frontpic, {
    			// 	// 	width: 89, height: 89
    			// 	// });
    			// }
    			return this;
    		}
    	})
    });
    
    MeiweiApp.Pages.MemberCoupon = new (MeiweiApp.PageView.extend({
        onClickLeftBtn: function() { MeiweiApp.goTo('MemberCenter'); },
    	initPage: function() {
    		this.coupon = MeiweiApp.me.coupon;
    		this.views = {
    			favoriteList: new MeiweiApp.Views.CouponList({
    				collection: this.coupon,
    				el: this.$('.restaurant-list')
    			})
    		};
    		this.initPageNav(this, this.coupon);
    	},
    	render: function() {
    		this.coupon.fetch({ reset: true });
    	}
    }))({el: $("#view-member-coupon")});
});

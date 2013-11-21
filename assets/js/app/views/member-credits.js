$(function() {
    var CreditList = MeiweiApp.CollectionView.extend({
    	ModelView: MeiweiApp.ModelView.extend({
    		template: TPL['member-credit-item'],
    		className: 'detail-list-item'
    	})
    });
    
    MeiweiApp.Pages.MemberCredits = new (MeiweiApp.PageView.extend({
        events: {
            'fastclick .header-btn-left': 'onClickLeftBtn',
            'fastclick .header-btn-right': 'onClickRightBtn',
            'fastclick .redeem-btn': 'goToProductRedeem'
        },
    	onClickLeftBtn: function() { MeiweiApp.goTo('MemberCenter'); },
    	goToProductRedeem: function() { MeiweiApp.goTo('ProductRedeem'); },
    	initPage: function() {
    		this.credits = new MeiweiApp.Collections.Credits();
    		this.views = {
    			creditList: new CreditList({
    				collection: this.credits,
    				el: this.$('.scroll-inner')
    			})
    		};
    	},
    	render: function() {
    		var self = this;
    		this.credits.fetch({
    			reset: true,
    			success: function(collection) {
    				var balance = _.reduce(collection.pluck('amount'), function(a,b) { return a + b; } );
    				self.$('> header > h1 > .balance').html('(' + balance + ')');
    				self.initScroller();
    			}
    		});
    	}
    }))({el: $("#view-member-credits")});
});

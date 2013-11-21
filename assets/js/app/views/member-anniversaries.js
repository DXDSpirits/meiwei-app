$(function() {
    MeiweiApp.Views.AnnversaryList = MeiweiApp.CollectionView.extend({
    	ModelView: MeiweiApp.ModelView.extend({
    		template: TPL['member-anniversary-item'],
    		className: 'anniversary-list-item',
    		events: { 'tap': 'modify' },
    		modify: function() {
    			MeiweiApp.goTo('MemberAnniversariyDetail', {
    				anniversary: this.model
    			});
    		}
    	}),
    	addAll: function() {
    		var $list = [];
    		for (var i=0; i<this.collection.length; i++) {
    			var lastItem = (i == 0 ? null : this.collection.at(i-1));
    			var item = this.collection.at(i);
    			var modelView = new this.ModelView({model: item});
    			if (lastItem == null || item.get('month') != lastItem.get('month')) {
    				$list.push($('<p class="month"></p>').html(item.get('month') + ' 月'));
    			}
    			$list.push(modelView.render().el);
    		}
    		this.$el.html($list);
    	},
    });
    
    MeiweiApp.Pages.MemberAnniversaries = new (MeiweiApp.PageView.extend({
    	onClickLeftBtn: function() { MeiweiApp.goTo('MemberCenter'); },
    	onClickRightBtn: function() {
    		MeiweiApp.goTo('MemberAnniversariyDetail');
    	},
    	initPage: function() {
    		this.anniversaries = new MeiweiApp.Collections.Anniversaries();
    		this.views = {
    			anniversaryList: new MeiweiApp.Views.AnnversaryList({
    				collection: this.anniversaries,
    				el: this.$('.scroll-inner')
    			})
    		};
    	},
    	render: function() {
    		this.anniversaries.fetch({ reset: true, success: this.initScroller });
    	}
    }))({el: $("#view-member-anniversaries")});
});

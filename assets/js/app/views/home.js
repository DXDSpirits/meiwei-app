
MeiweiApp.Views.RecommendItem = MeiweiApp.ModelView.extend({
	//events: { 'click': 'viewRestaurant' },
	tagName: 'section',
	className: 'recommend-list-item',
	template: MeiweiApp.Templates['recommend-list-item'],
	viewRestaurant: function() {
		var restaurantId = this.model.get('restaurant').id
		MeiweiApp.Router.navigate('restaurant/' + restaurantId, {trigger: true});
	}
});

MeiweiApp.Views.RecommendItems = MeiweiApp.CollectionView.extend({
	modelView: MeiweiApp.Views.RecommendItem
})

MeiweiApp.Pages.Home = new (MeiweiApp.PageView.extend({
	initialize: function() {
		this.recommend = new MeiweiApp.Models.Recommend({id: 1});
		this.views.recommendItems = new MeiweiApp.Views.RecommendItems({
			collection: this.recommend.items,
			el: this.$('.scroll .wrapper')
		});
		_.bindAll(this, 'renderRecommendList');
	},
	renderRecommendList: function() {
		this.views.recommendItems.render();
		this.scroller = new IScroll(this.$('.scroll').selector, {
			scrollX: false, scrollY: true, momentum: true
		});
	},
	show: function() {
		this.recommend.fetch({success: this.renderRecommendList});
		this.slideIn();
	}
}))({el: $("#view-home")});

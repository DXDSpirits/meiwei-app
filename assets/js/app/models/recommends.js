
MeiweiApp.Models.RecommendItem = MeiweiApp.Model.extend({
});

MeiweiApp.Collections.RecommendItems = MeiweiApp.Collection.extend({
	model: MeiweiApp.Models.RecommendItem
});

MeiweiApp.Models.Recommend = MeiweiApp.Model.extend({
	name: 'MeiweiApp.Models.Recommend',
	initialize: function() {
		if (this.items == null) this.items = new MeiweiApp.Collections.RecommendItems();
	},
	urlRoot: MeiweiApp.configs.APIHost + '/restaurants/recommend/',
	parse: function(response) {
		this.initialize();
		this.items.reset(response.recommenditem_set);
		return response;
	}
});

MeiweiApp.Collections.Recommends = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/restaurants/recommend/',
	model: MeiweiApp.Models.Recommend
});


MeiweiApp.Models.RecommendItem = MeiweiApp.Model.extend({
});

MeiweiApp.Collections.RecommendItems = MeiweiApp.Collection.extend({
	model: MeiweiApp.Models.RecommendItem
});

MeiweiApp.Models.Recommend = MeiweiApp.Model.extend({
	initialize: function() {
		if (this.items == null) this.items = new MeiweiApp.Collections.RecommendItems();
	},
	urlRoot: MeiweiApp.configs.APIHost + '/restaurants/recommend/',
	parse: function(response) {
		this.initialize();
		this.items.reset(response.recommenditem_set)
		response.recommenditem_set = null;
		return response;
	}
});

MeiweiApp.Collections.Recommends = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/restaurants/recommend/',
	model: MeiweiApp.Models.Recommend
});


MeiweiApp.Models.RecommendItem = MeiweiApp.Model.extend({
});

MeiweiApp.Collections.RecommendItems = MeiweiApp.Collection.extend({
	model: MeiweiApp.Models.RecommendItem
});

MeiweiApp.Models.Recommend = MeiweiApp.Model.extend({
	initialize: function() {
		this.items = new MeiweiApp.Collections.RecommendItems(this.get('recommenditem_set'));
		this.on('change:recommenditem_set', function() {
            this.items.reset(this.get('recommenditem_set'));
        }, this);
	},
	urlRoot: MeiweiApp.configs.APIHost + '/restaurants/recommend/'
});

MeiweiApp.Collections.Recommends = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/restaurants/recommend/',
	model: MeiweiApp.Models.Recommend
});

MeiweiApp.Models.RecommendName = MeiweiApp.Model.extend({
    urlRoot: MeiweiApp.configs.APIHost + '/restaurants/recommendname/',
});
MeiweiApp.Collections.RecommendNames = MeiweiApp.Collection.extend({
    url: MeiweiApp.configs.APIHost + '/restaurants/recommendname/',
    model: MeiweiApp.Models.RecommendName
});

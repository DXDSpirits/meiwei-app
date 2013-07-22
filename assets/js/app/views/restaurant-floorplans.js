
MeiweiApp.Views.FloorplanList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		template: Mustache.compile("{{caption}} - {{path}}"),
		initialize: function() {
			this.$el.attr("id", "floorplan" + this.model.id);
		}
	})
});

MeiweiApp.Pages.RestaurantFloorplans = new (MeiweiApp.PageView.extend({
	initPage: function() {
		this.restaurant = new MeiweiApp.Models.Restaurant();
		/*this.views = {
			floorplanList: new MeiweiApp.Views.FloorplanList({
				collection: this.restaurant.floorplans,
				el: this.$('.scroll-inner')
			})
		}*/
		_.bindAll(this, 'fetchFloorplans', 'renderFloorplans');
	},
	renderFloorplans: function() {
		var plan = this.restaurant.floorplans.at(0);
		$.get(plan.get('path'), function(data) {
			$("#svg").html($(data).find('svg'));
		});
	},
	fetchFloorplans: function(model, response, options) {
		this.$('> header h1').html(this.restaurant.get('fullname'));
		$.when(
			this.restaurant.floorplans.fetch({ success: this.renderFloorplans })
		).then(this.showPage);
	},
	render: function() {
		this.restaurant.set({id: arguments[0]});
		this.restaurant.fetch({ success: this.fetchFloorplans });
	}
}))({el: $("#view-restaurant-floorplans")});

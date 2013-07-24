
MeiweiApp.Views.FloorplanNav = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		initialize: function() {
			this.model.on('select', this.onSelect, this);
		},
		className: 'floorplan-nav-item',
		template: Mustache.compile("{{caption}}"),
		events: { 'click' : 'triggerSelect' },
		triggerSelect: function() {
			this.model.trigger('select');
		},
		onSelect: function() {
			this.$el.siblings().removeClass('selected');
			this.$el.addClass('selected');
		},
	})
});

MeiweiApp.Views.FloorplanList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		initialize: function() {
			this.model.on('select', this.onSelect, this);
		},
		onSelect: function() {
			this.$el.siblings().addClass('hide');
			this.$el.removeClass('hide');
		},
		tagName: "div",
		className: "svg-item hide",
		render: function() {
			var plan = this.model;
			var self = this;
			$.get(plan.get('path'), function(data) {
				var svg = $(data).find('svg');
				$(svg).attr('width', '100%');
				$(svg).attr('height', '400px');
				self.$el.html(svg);
				self.model.trigger('select');
			});
			return this;
		}
	})
});

MeiweiApp.Pages.RestaurantFloorplans = new (MeiweiApp.PageView.extend({
	initPage: function() {
		this.restaurant = new MeiweiApp.Models.Restaurant();
		this.floorplans = new MeiweiApp.Collections.Floorplans();
		this.views = {
			floorplanList: new MeiweiApp.Views.FloorplanList({
				collection: this.floorplans,
				el: this.$('.svg-canvas-inner')
			}),
			floorplanNav: new MeiweiApp.Views.FloorplanNav({
				collection: this.floorplans,
				el: this.$('.floorplan-nav')
			})
		}
		_.bindAll(this, 'fetchFloorplans', 'renderFloorplans');
	},
	onClickLeftBtn: function() { MeiweiApp.Pages.RestaurantDetail.showPage(); },
	onClickRightBtn: function() { MeiweiApp.Pages.RestaurantDetail.showPage(); },
	renderFloorplans: function() {
		var myScroll = new IScroll('.svg-canvas', {
			scrollX: true,
			freeScroll: true,
			zoom: true,
			mouseWheel: true,
			wheelAction: 'zoom',
			preventDefault: false
		});
	},
	fetchFloorplans: function(model, response, options) {
		this.$('> header h1').html(this.restaurant.get('fullname'));
		this.floorplans.url = this.restaurant.get('floorplans');
		$.when(
			this.floorplans.fetch({ success: this.renderFloorplans })
		).then(this.showPage);
	},
	render: function(options) {
		this.restaurant.set({id: options.restaurantId});
		this.restaurant.fetch({ success: this.fetchFloorplans });
	}
}))({el: $("#view-restaurant-floorplans")});

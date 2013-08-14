
MeiweiApp.Views.FloorplanNav = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		initialize: function() {
			this.listenTo(this.model, 'select', this.onSelect);
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
		}
	})
});

MeiweiApp.Views.Floorplan = MeiweiApp.ModelView.extend({
	events: {'click .table':'selectSeat'},
	initialize: function() {
		this.seatMap = {};
		this.options = {
			maxSeat: 1,
			size: 0
		};
	},
	onSelect: function(model) {
  		var svg = model.get('svgString');
 		this.$el.empty();
  		$(svg).attr('max-width', '100%');
		$(svg).attr('max-height', '100%');
 		this.$el.html(svg);
		this.model = model;
	},
	tagName: "div",
	className: "svg-item",
	selectSeat: function(e){
		var $t = $(e.target);
		var id = this.model.get("id");
		
		if($t.attr("status")=="available") {
			if( this.options.size >= this.options.maxSeat){
				if(window.confirm("很抱歉，你所选桌位已超出预设数目！\n点击确认重新选择。")){
					this.$el.find("[status=selected]").attr("status","available");
					this.seatMap = {};
					this.options.size = 0;
				}
				return;
			}
			$t.attr("status","selected");
			this.options.size +=1;
			if(!this.seatMap[id]) this.seatMap[id] = {};
			this.seatMap[id][$t.attr("tableid")] = null;
		} else if ($t.attr("status")=="selected"){
			$t.attr("status","available");
			this.options.size-=1;
			delete this.seatMap[id][$t.attr("tableid")];
		}
	},
	render: function() {
		var self = this;
		$.each(this.collection.models,function(){
			var m = this;
			$.get(this.get('path'), function(data) {
				var svg = $(data).find('svg');
				$(svg).find('pattern .table').attr({'class': null, 'status': null});
 				m.set("svgString" ,svg );
 				self.listenTo( m , 'select' , function(){ self.onSelect(m) } );
 				m.trigger('select');
			});
		});
		return this;
	}																			
});

MeiweiApp.Pages.RestaurantFloorplans = new (MeiweiApp.PageView.extend({
	onClickLeftBtn: function(){
		this.onClickRightBtn();
	},onClickRightBtn: function() {
		$.each(this.views.floorplanList.modelViews , function(){
			if(this.options.size>0)
			this.model.trigger("selected",JSON.stringify(this.seatMap));
		});
  		MeiweiApp.goBack();
 	},
	initPage: function() {
		this.restaurant = new MeiweiApp.Models.Restaurant();
		this.floorplans = new MeiweiApp.Collections.Floorplans();
		this.views = {
			floorplanList: new MeiweiApp.Views.Floorplan({
				collection: this.floorplans,
				el: this.$('.svg-canvas-inner')
			}),
			floorplanNav: new MeiweiApp.Views.FloorplanNav({
				collection: this.floorplans,
				el: this.$('.floorplan-nav')
			})
		}
		_.bindAll(this , 'renderFloorplans');
	},
	renderFloorplans: function() {
		if (this.scroller == null) {
			this.scroller = new IScroll('.svg-canvas', {
				scrollX: true,
				freeScroll: true,
				/*zoom: true,
				mouseWheel: true,
				wheelAction: 'zoom',*/
				//preventDefault: false
				click: true
			});
		} else {
			this.scroller.refresh();
		}
	},
	render: function() {
		this.floorplans.reset(this.options.floorplans.models);
		this.views.floorplanList.render();
		this.renderFloorplans();
		this.showPage();
	}
}))({el: $("#view-restaurant-floorplans")});

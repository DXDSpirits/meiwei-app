
MeiweiApp.Views.FloorplanNav = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		initialize: function() {
			this.model.on('select', this.onSelect, this );
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

MeiweiApp.Views.FloorplanList = MeiweiApp.CollectionView.extend({
	// getIdVar: function(){
		// var tables = [];
		// $.each(this.modelViews , function(){
			// var idVar = "\""+ this.model.get('id')+"\"";
			// var _ids = this.getId();
			// if(_ids && _ids.length>0){
				// idVar+= ":\""+_ids.join(",")+"\"";
				// tables.push(idVar);
			// }
		// });
		// return "{"+tables.join(",")+"}";
	// },
	ModelView: MeiweiApp.ModelView.extend({
		events: {'click .table':'selectSeat'},
		initialize: function() {
			this.seatMap = {};
			this.options={colorAvailable : "#669933",colorSelected : "#77513D",colorOccupied : "#E6E6E6" , maxSeat: 1 , size: 0};
			this.model.on('select', this.onSelect, this);
		},
		onSelect: function() {
			this.$el.siblings().addClass('hide');
			this.$el.removeClass('hide');
		},
		tagName: "div",
		className: "svg-item hide",
		selectSeat: function(e){
			var $t = $(e.target);
			var id = this.model.get("id");
			
			if($t.attr("status")=="available"){
				if( this.options.size >= this.options.maxSeat){
					if(window.confirm("很抱歉，你所选桌位已超出预设数目！\n点击确认重新选择。")){
						this.$el.find("[status=selected]").attr("status","available").attr("fill", this.options.colorAvailable);
						this.seatMap = {};
						this.options.size = 0;
					}
					return;
				}
				$t.attr("status","selected").attr("fill", this.options.colorSelected);
				this.options.size +=1;
				if(!this.seatMap[id]) this.seatMap[id] = {};
				this.seatMap[id][$t.attr("tableid")] = null;
			}else if($t.attr("status")=="selected"){
				$t.attr("status","available").attr("fill", this.options.colorAvailable);
				this.options.size-=1;
				delete this.seatMap[id][$t.attr("tableid")];
			}
			console.log(this.seatMap)
		},
		// getId: function(){
			// this.idArray = [];
			// var $this = this;
			// this.each( function(item){
				// if($(item).attr("status")=="selected"){
					// $this.idArray.push($(item).attr("tableid"));
				// }
			// });
			// return this.idArray;
		// },
		// initSeatMap: function(){
			// this.seatMap = $.parseJSON( null ) || {};
		// },
		// lightSeat: function(){
			// var idVar = this.seatMap[this.model.get('id')];
			// if(!idVar) return;
// 			
			// var $this = this;
			// this.each( function(item){
				// if(idVar.match($(item).attr('tableid'))){
					// $(item).attr("status","selected");
					// $(item).attr("fill", $this.options.colorSelected);
				// }else{
					// if($(item).attr("status")!="occupied"){
						// $(item).attr("status","available");
						// $(item).attr("fill", $this.options.colorAvailable);
					// }
				// }
			// });
		// },
		// each: function(callback){
			// this.$el.find("[class=table]").each(function(){
				// callback(this);
			// });
		// },
		render: function() {
			var plan = this.model;
			var self = this;
			$.get(plan.get('path'), function(data) {
				var svg = $(data).find('svg');
				$(svg).attr('width', '100%');
				$(svg).attr('height', '400px');
				self.$el.html(svg);
				self.model.trigger('select');			
				//self.lightSeat();
			});
			return this;
		}
	})																							
});

MeiweiApp.Pages.RestaurantFloorplans = new (MeiweiApp.PageView.extend({
	onClickLeftBtn: function(){
		
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
			floorplanList: new MeiweiApp.Views.FloorplanList({
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
		var myScroll = new IScroll('.svg-canvas', {
			scrollX: true,
			freeScroll: true,
			zoom: true,
			mouseWheel: true,
			wheelAction: 'zoom',
			preventDefault: false
		});
	},
	render: function(options) {
		this.options = this.options || {};
		_.extend(this.options, options);
		this.floorplans.reset(options.floorplans.models);
		this.views.floorplanNav.render();
		this.views.floorplanList.render();
		this.renderFloorplans();
		this.showPage();
	}
}))({el: $("#view-restaurant-floorplans")});

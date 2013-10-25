$(function() {
    MeiweiApp.Views.FloorplanNav = MeiweiApp.CollectionView.extend({
    	ModelView: MeiweiApp.ModelView.extend({
    		className: 'floorplan-nav-item',
    		template: Mustache.compile("{{caption}}"),
    		events: { 'fastclick': 'triggerSelect' },
    		initModelView: function() {
    			this.listenTo(this.model, 'select', this.onSelect);
    		},
    		triggerSelect: function() {
    			this.model.trigger('select');
    		},
    		onSelect: function() {
    			this.$el.siblings().removeClass('selected');
    			this.$el.addClass('selected');
    		}
    	})
    });
    
    MeiweiApp.Views.Floorplan = MeiweiApp.View.extend({
    	events: { 'tap .table': 'selectSeat' },
    	onSelect: function(model) {
    		this.$el.find("[status=selected]").attr("status", "available");
    		this.model = model;
      		var svg = model.get('svgString');
      		$(svg).attr('width', '100%');
    		$(svg).attr('height', '100%');
     		this.$el.html(svg);
    	},
    	selectSeat: function(e){
    		var $t = $(e.target);
    		var id = this.model.get("id");
    		if($t.attr("status") == "available") {
    			this.$el.find("[status=selected]").attr("status", "available");
    			$t.attr("status","selected");
    			this.selectedSeat = id + '|' + $t.attr("tableid");
    		} else if ($t.attr("status") == "selected"){
    			$t.attr("status", "available");
    			this.selectedSeat = null;
    		}
    	},
    	render: function() {
    		var self = this;
    		this.collection.forEach(function(model) {
    			$.get(model.get('path'), function(data) {
    				var svg = $(data).find('svg');
    				$(svg).find('pattern .table').attr({'class': null, 'status': null});
     				model.set("svgString", svg);
     				self.listenTo(model, 'select', function() { self.onSelect(model); });
     				model.trigger('select');
    			});
    		});
    		return this;
    	}																			
    });
    
    MeiweiApp.Pages.RestaurantFloorplans = new (MeiweiApp.PageView.extend({
    	onClickLeftBtn: function() { this.onClickRightBtn(); },
    	onClickRightBtn: function() {
    		this.options.onSelected(this.views.floorplanList.selectedSeat);
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
    		};
    	},
    	initScroller: function() {
    		if (this.scroller == null) {
    			this.scroller = new IScroll(this.$('.svg-canvas').selector, {
    				scrollX: true, freeScroll: true, tap: true,
    				zoom: true, mouseWheel: true, wheelAction: 'zoom',
    				HWCompositing: false
    			});
    		} else {
    			this.scroller.refresh();
    		}
    	},
    	render: function() {
    		this.floorplans.reset(this.options.floorplans);
    		this.views.floorplanList.render();
    		this.initScroller();
    	}
    }))({el: $("#view-restaurant-floorplans")});
});

$(function() {
    MeiweiApp.Pages.GetStarted = new (MeiweiApp.PageView.extend({
    	initPage: function() {
    		this.pics = [
    			'assets/img/getstarted/1@640x1096.png',
    			'assets/img/getstarted/2@640x1096.png',
    			'assets/img/getstarted/3@640x1096.png',
    			'assets/img/getstarted/4@640x1096.png',
    			'assets/img/getstarted/5@640x1096.png'
    		];
    	},
        events: {
            'tap .carousel-item.getstarted': 'getstarted'
        },
        getstarted: function() {
            localStorage.setItem('first-time', true);
            MeiweiApp.goTo('Home');
            this.scroller.destroy();
            this.undelegateEvents();
            this.$('.carousel-inner').empty();
        },
        initScroller: function() {
        	if (this.scroller == null) {
                if (this.$('.carousel').length > 0) {
                    this.scroller = new IScroll(this.$('.carousel').selector, {
                        scrollX: true, scrollY: false, momentum: false, snap: true, tap: true,
                        indicators: {
                            el: this.$('.indicator')[0],
                            resize: false
                        }
                    });
                }
            } else {
                this.scroller.refresh();
            }
        },
        fillImages: function() {
        	var $list = [];
        	for (var i=0; i<this.pics.length; i++) {
        		$list.push($('<div></div>').addClass('carousel-item').css('background-image', 'url(' + this.pics[i] + ')'));
        	}
        	$list[$list.length-1].addClass('getstarted');
        	this.$('.carousel-inner').html($list);
        },
        adjustWidth: function() {
        	var bodyWidth = $('body').innerWidth();
            var items = this.$('.carousel > .carousel-inner > .carousel-item');
            for (var i=0; i<items.length; i++) {
            	$(items[i]).css('width', bodyWidth);
            }
            this.$('.carousel > .carousel-inner').css('width', items.length * $(items[0]).outerWidth());
        },
        render: function() {
        	this.fillImages();
        	this.adjustWidth();
            this.initScroller();
        }
    }))({el: $("#view-getstarted")});
});

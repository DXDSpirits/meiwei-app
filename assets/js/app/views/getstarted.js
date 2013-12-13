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
            'click .getstarted': 'getstarted'
        },
        getstarted: function() {
            localStorage.setItem('first-time', true);
            MeiweiApp.goTo('Home');
            this.undelegateEvents();
            this.$('.carousel-inner').empty();
        },
        fillImages: function() {
        	var $list = [];
        	for (var i=0; i<this.pics.length; i++) {
        		var $img = $('<div></div>').addClass('img').css('background-image', 'url(' + this.pics[i] + ')');
        		$list.push($('<div></div>').addClass('carousel-item').html($img));
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
        }
    }))({el: $("#view-getstarted")});
});

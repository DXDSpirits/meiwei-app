(function() {
    MeiweiApp.Pages.GetStarted = new (MeiweiApp.PageView.extend({
    	initPage: function() {
    		this.pics = [
    			'assets/images/getstarted/1@640x1096.png',
    			'assets/images/getstarted/2@640x1096.png',
    			'assets/images/getstarted/3@640x1096.png',
    			'assets/images/getstarted/4@640x1096.png',
    			'assets/images/getstarted/5@640x1096.png'
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
        	var bodyWidth = $('.view').innerWidth();
            var items = this.$('.carousel-item'), itemWidth = $(items[0]).outerWidth(),
                wrapperWidth = this.$('.carousel').innerWidth(),
                margin = (wrapperWidth - itemWidth) / 2;
            for (var i=0; i<items.length; i++) {
                $(items[i]).css('width', bodyWidth);
            }
            this.$('.carousel-inner').css({
                'width': items.length * itemWidth + 2 * margin,
                'padding-left': margin,
                'padding-right': margin
            });
            
        },
        render: function() {
        	this.fillImages();
        	this.adjustWidth();
        }
    }))({el: $("#view-getstarted")});
})();

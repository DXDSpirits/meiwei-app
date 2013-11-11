$(function() {
    MeiweiApp.Pages.GetStarted = new (MeiweiApp.PageView.extend({
        events: {
            'tap .carousel-item.getstarted': 'getstarted'
        },
        getstarted: function() {
            localStorage.setItem('first-time', true);
            MeiweiApp.goTo('Home');
        },
        render: function() {
            var items = this.$('.carousel > .carousel-inner > .carousel-item');
            this.$('.carousel > .carousel-inner').css('width', items.length * $(items[0]).outerWidth());
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
        }
    }))({el: $("#view-getstarted")});
});

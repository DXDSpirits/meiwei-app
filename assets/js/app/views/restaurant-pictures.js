$(function() {
    var pictureCarousel = MeiweiApp.CollectionView.extend({
        ModelView: MeiweiApp.ModelView.extend({
            template: Mustache.compile('<img src="{{{ path }}}" alt="">'),
            className: 'picture-item carousel-item',
        })
    });
    
    MeiweiApp.Pages.RestaurantPictures = new (MeiweiApp.PageView.extend({
        initPage: function() {
            _.bindAll(this, 'renderPages', 'updateTitle');
            this.pictures = new MeiweiApp.Collections.Pictures();
            this.views = {
                pictureCarousel: new pictureCarousel({
                    collection: this.pictures,
                    el: this.$('.carousel-inner')
                })
            };
        },
        onClickLeftBtn: function() {
            this.pictures.reset();
            MeiweiApp.goBack();
        },
        updateTitle: function() {
            if (this.scroller) {
                this.$('> header h1').html((this.scroller.currentPage.pageX + 1) + '/' + this.scroller.pages.length);
            } else {
                this.$('> header h1').html('0/0');
            }
        },
        renderPages: function() {
            if (this.pictures.length > 0) {
                this.$('.viewport').removeClass('hidden');
                var items = this.$('.carousel > .carousel-inner > .carousel-item');
                this.$('.carousel > .carousel-inner').css('width', items.length * $(items[0]).outerWidth());
                if (this.scroller == null) {
                    if (this.$('.carousel').length > 0) {
                        this.scroller = new IScroll(this.$('.carousel').selector, {
                            scrollX: true, scrollY: false, momentum: false, snap: true, tap: true
                        });
                    }
                    this.updateTitle();
                    this.scroller.on('scrollEnd', this.updateTitle);
                } else {
                    this.scroller.refresh();
                }
            }
        },
        render: function() {
            this.pictures.reset(this.options.pictures);
            this.renderPages();
        }
    }))({el: $("#view-restaurant-pictures")});
});

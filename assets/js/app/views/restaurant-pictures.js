$(function() {
    var pictureCarousel = MeiweiApp.CollectionView.extend({
        ModelView: MeiweiApp.ModelView.extend({
            template: '<img src="{{{ path }}}" alt="">',
            className: 'picture-item carousel-item',
        })
    });
    
    MeiweiApp.Pages.RestaurantPictures = new (MeiweiApp.PageView.extend({
        events: {
            'click .header-btn-left': 'onClickLeftBtn',
            'touchend .carousel': 'updateTitle'
        },
        initPage: function() {
            _.bindAll(this, 'renderPages');
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
            var x = this.$('.carousel').scrollLeft(),
                items = this.$('.carousel-item'), itemWidth = $(items[0]).outerWidth(), 
                page = parseInt(x / itemWidth);
            if (items) {
                this.$('.header-title').html((page + 1) + '/' + items.length);
            } else {
                this.$('.header-title').html('0/0');
            }
        },
        renderPages: function() {
            this.$('.viewport').removeClass('hidden');
            var items = this.$('.carousel-item'), itemWidth = $(items[0]).outerWidth(),
                wrapperWidth = this.$('.carousel').innerWidth(),
                margin = (wrapperWidth - itemWidth) / 2;
            this.$('.carousel-inner').css({
                'width': items.length * itemWidth + 2 * margin,
                'padding-left': margin,
                'padding-right': margin
            });
            this.updateTitle();
        },
        render: function() {
            this.pictures.reset(this.options.pictures);
            this.renderPages();
        }
    }))({el: $("#view-restaurant-pictures")});
});

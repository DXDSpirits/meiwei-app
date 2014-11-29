(function() {
    
    var PackageOrderCreation = MeiweiApp.Model.extend({
        urlRoot: MeiweiApp.configs.APIHost + '/orders/orderpackage/'
    });
    
    MeiweiApp.Pages.PackageOrder = new (MeiweiApp.PageView.extend({
        events: {
            'click .header-btn-left': 'onClickLeftBtn',
            'click .header-btn-right': 'onClickRightBtn',
            'click .btn-invite': 'onClickBtnInvite',
            'click .btn-continue': 'onClickBtnContinue',
            'click .option-tabs .btn': 'selectOption'
        },
        initPage: function() {
            this.stat = new (MeiweiApp.Model.extend({
                urlRoot: MeiweiApp.configs.APIHost + '/clients/package_order_stat/'
            }))();
            this.stat.fetch();
        },
        onClickBtnInvite: function() {
            MeiweiApp.sendWeixinMsg('你的TA在“以爱之名 兑现诺言”活动中，向你发起了“敢爱礼盒”，你敢兑现你的承诺吗？点击查看详情 http://mobile.clubmeiwei.com/#packageorder');
        },
        onClickBtnContinue: function() {
            var birthday = this.$('input[name=birthday]').val() || null;
            var anniversary = this.$('input[name=anniversary]').val() || null;
            if (!birthday || !anniversary) {
                MeiweiApp.showAlertDialog('请完善生日和纪念日信息');
            } else {
                var order = new PackageOrderCreation({
                    birthday: birthday,
                    anniversary: anniversary,
                    option_christmas: this.$('.product-christmas .option-tabs .active').data('target'),
                    option_valentine: this.$('.product-valentine .option-tabs .active').data('target')
                });
                MeiweiApp.goTo('PackageOrderConfirm', {
                    order: order
                });
            }
        },
        selectOption: function(e) {
            var $tab = $(e.currentTarget);
            var target = +$tab.data('target');
            var panel = $tab.closest('.package-product').find('.panel')[target];
            $tab.addClass('active').siblings().removeClass('active');
            $(panel).removeClass('hidden').siblings().addClass('hidden');
        },
        renderAll: function() {
            var items = this.$('.carousel-item'), itemWidth = $(items[0]).outerWidth(),
                wrapperWidth = this.$('.carousel').width(),
                margin = (wrapperWidth - itemWidth) / 2;
            this.$('.carousel-inner').css({
                'width': 5 * itemWidth + 2 * margin,
                'padding-left': margin,
                'padding-right': margin
            });
            var count = this.stat.get('count') || localStorage.getItem('package_order_stat') || 20129;
            this.$('.count>span').text(count);
            localStorage.setItem('package_order_stat', count);
            this.$('.wrapper').removeClass('rendering');
        },
        reset: function() {
            this.$('.wrapper').addClass('rendering');
        },
        render: function() {
            var self = this;
            var order = new MeiweiApp.Models.PackageOrder();
            order.fetch({
                success: function() {
                    if (order.id) {
                        MeiweiApp.goTo('PackageOrderDetail', {
                            order: order.toJSON()
                        });
                    } else {
                        self.renderAll();
                    }
                },
                error: function() {
                    self.renderAll();
                }
            });
        }
    }))({el: $("#view-package-order")});
})();

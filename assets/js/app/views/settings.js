
MeiweiApp.Pages.Settings = new (MeiweiApp.PageView.extend({
    events: {
        'fastclick .header-btn-left': 'onClickLeftBtn',
        'fastclick .header-btn-right': 'onClickRightBtn',
        'tap .lang-opt.zh': 'switchToZh',
        'tap .lang-opt.en': 'switchToEn',
    },
    initPage: function() { },
    switchToZh: function() {
        this.$('.lang-opt.zh').addClass('selected');
        this.$('.lang-opt.en').removeClass('selected');
        MeiweiApp.setLang('zh');
    },
    switchToEn: function() {
        this.$('.lang-opt.en').addClass('selected');
        this.$('.lang-opt.zh').removeClass('selected');
        MeiweiApp.setLang('en');
    },
    render: function() {
        if (MeiweiApp.getLang() == 'en') {
            this.switchToEn();
        } else {
            this.switchToZh();
        }
    }
}))({el: $("#view-settings")});

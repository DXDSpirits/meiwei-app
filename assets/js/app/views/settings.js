$(function() {
    MeiweiApp.Pages.Settings = new (MeiweiApp.PageView.extend({
        events: {
            'fastclick .header-btn-left': 'onClickLeftBtn',
            'tap .lang-opt.zh': 'switchToZh',
            'tap .lang-opt.en': 'switchToEn',
            'tap .btn-share-weixin': 'onClickWeixinBtn',
            'tap .btn-share-weibo': 'onClickWeiboBtn',
            'tap .settings-request-driver': 'goToRequestDriver'
        },
        initPage: function() { },
        goToRequestDriver: function() {
            MeiweiApp.goTo('RequestDriver');
        },
        askToRestartApp: function() {
            MeiweiApp.showConfirmDialog(
                MeiweiApp._('Restart Application'),
                MeiweiApp._('An application restart is required to apply language setting. Restart now?'),
                function() { window.location.reload(); }
            );
        },
        switchToZh: function() {
            MeiweiApp.sendGaEvent('language', 'switch', 'zh');
            this.$('.lang-opt.zh').addClass('selected');
            this.$('.lang-opt.en').removeClass('selected');
            MeiweiApp.setLang('zh');
            this.askToRestartApp();
        },
        switchToEn: function() {
            MeiweiApp.sendGaEvent('language', 'switch', 'en');
            this.$('.lang-opt.en').addClass('selected');
            this.$('.lang-opt.zh').removeClass('selected');
            MeiweiApp.setLang('en');
            this.askToRestartApp();
        },
        getWeiboLink : function(s, d, e, r, l, p, t, z, c) {
            var f = 'http://v.t.sina.com.cn/share/share.php?appkey=', u = z || d.location,
            p = ['&url=', e(u), '&title=', e(t || d.title), '&source=', e(r), '&sourceUrl=', e(l), 
                '&content=', c || 'gb2312', '&pic=', e(p || ''), '&ralateUid=', '3058840707'].join('');
            return [f, p].join('');
        },
        onClickWeiboBtn : function() {
            if (!MeiweiApp.me.id) MeiweiApp.me.fetch();
            var url = 'http://web.clubmeiwei.com/ad/apppromo?ref=' + MeiweiApp.me.id;
            var content  = '美位网手机应用华丽登场土豪时代，快来体验高品质订餐和贴心的私人管家服务！';
            var pic = 'http://web.clubmeiwei.com/assets/img/apppromo.jpg';
            var link = this.getWeiboLink(screen, document, encodeURIComponent,
                                         'http://www.clubmeiwei.com', 'http://www.clubmeiwei.com',
                                         pic, content, url, 'utf-8');
            var ref = window.open(link ,'_blank', 'location=no');
            MeiweiApp.sendGaSocial('weibo', 'tweet', 'app promo');
        },
        onClickWeixinBtn: function() {
            if (!MeiweiApp.me.id) MeiweiApp.me.fetch();
            var url = 'http://web.clubmeiwei.com/ad/apppromo?ref=' + MeiweiApp.me.id;
            var content  = '美位网手机应用华丽登场土豪时代，快来体验高品质订餐和贴心的私人管家服务！';
            var pic = 'http://web.clubmeiwei.com/assets/img/apppromo.jpg';
            MeiweiApp.shareToMoments(url, content, pic);
            MeiweiApp.sendGaSocial('weixin', 'share to moments', 'app promo');
        },
        render: function() {
            this.$('.version-no').html(MeiweiApp.Version);
            this.$('.lang-opt.zh').toggleClass('selected', MeiweiApp.getLang() == 'zh');
            this.$('.lang-opt.en').toggleClass('selected', MeiweiApp.getLang() == 'en');
        }
    }))({el: $("#view-settings")});
});


MeiweiApp.Pages.Settings = new (MeiweiApp.PageView.extend({
    events: {
        'fastclick .header-btn-left': 'onClickLeftBtn',
        'fastclick .header-btn-right': 'onClickRightBtn',
        'tap .lang-opt.zh': 'switchToZh',
        'tap .lang-opt.en': 'switchToEn',
        'tap .btn-share-weixin': 'onClickWeixinBtn',
        'tap .btn-share-weibo': 'onClickWeiboBtn'
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
    getWeiboLink : function(s, d, e, r, l, p, t, z, c) {
        var f = 'http://v.t.sina.com.cn/share/share.php?appkey=', u = z || d.location,
        p = ['&url=', e(u), '&title=', e(t || d.title), '&source=', e(r), '&sourceUrl=', e(l), 
            '&content=', c || 'gb2312', '&pic=', e(p || ''), '&ralateUid=', '3058840707'].join('');
        return [f, p].join('');
    },
    onClickWeiboBtn : function() {
        var url = 'http://web.clubmeiwei.com/ad/apppromo?ref=' + MeiweiApp.me.id;
        var content  = '美位网手机应用华丽登场土豪时代，快来体验高品质订餐和贴心的私人管家服务！ ';
        var pic =  'http://web.clubmeiwei.com/assets/img/apppromo.jpg';
        var link = this.getWeiboLink(screen, document, encodeURIComponent,
                                     'http://www.clubmeiwei.com', 'http://www.clubmeiwei.com', 
                                     pic, content, url, 'utf-8');
        var ref = window.open(link ,'_blank', 'location=no');
    },
    onClickWeixinBtn: function() {
        var url = 'http://web.clubmeiwei.com/ad/apppromo?ref=' + MeiweiApp.me.id;
        var content  = '美位网手机应用华丽登场土豪时代，快来体验高品质订餐和贴心的私人管家服务！ ';
        var pic =  'http://web.clubmeiwei.com/assets/img/apppromo.jpg';
        MeiweiApp.shareToMoments(url, content, pic);
    },
    render: function() {
        MeiweiApp.me.fetch();
        if (MeiweiApp.getLang() == 'en') {
            this.switchToEn();
        } else {
            this.switchToZh();
        }
    }
}))({el: $("#view-settings")});

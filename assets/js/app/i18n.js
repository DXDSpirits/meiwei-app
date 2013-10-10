MeiweiApp.i18n = {
    'Circles': {
        zh: '全部商圈',
        en: 'Circles'
    },
    'Cuisines': {
        zh: '全部菜系',
        en: 'Cuisines'
    },
    'Next Page': {
        zh: '上一页',
        en: 'Next Page'
    },
    'Previous Page': {
        zh: '下一页',
        en: 'Previous Page'
    },
    'Reserve': {
        zh: '订餐',
        en: 'Book'
    },
    'Call Us': {
        zh: '客服电话',
        en: 'Call Us'
    },
    'Reservation Detail': {
        zh: '预订信息',
        en: 'Reservation Detail'
    },
    'Select Contact': {
        zh: '选择预订人',
        en: 'Select Contact'
    },
    'Select Seat': {
        zh: '桌位选择',
        en: 'Select Seat'
    },
    'Submit Order': {
        zh: '提交订单',
        en: 'Submit Order'
    },
    'Floorplan': {
        zh: '桌位',
        en: 'Floorplan'
    },
    'Member Center': {
        zh: '用户中心',
        en: 'Member Center'
    },
    'My': {
        zh: '我的',
        en: 'My '
    },
    'Profile': {
        zh: '资料',
        en: 'Profile'
    },
    'Reservations': {
        zh: '订单',
        en: 'Reservations'
    },
    'Credits': {
        zh: '积分',
        en: 'Credits'
    },
    'Favorites': {
        zh: '收藏',
        en: 'Favorites'
    },
    'Concierge': {
        zh: '私人管家',
        en: 'Concierge'
    },
    'Concierge Services': {
        zh: '私人管家服务',
        en: 'Concierge Services'
    },
    'Anniversaries': {
        zh: '纪念日',
        en: 'Anniversaries'
    },
    'Logout': {
        zh: '退出登录',
        en: 'Logout'
    },
    'Login': {
        zh: '登录',
        en: 'Login'
    },
    'Register': {
        zh: '注册',
        en: 'Register'
    },
    'Social Login': {
        zh: '公共帐号登录',
        en: 'Social Login'
    },
    'Email': {
        zh: '邮箱',
        en: 'Email'
    },
    'Mobile': {
        zh: '手机',
        en: 'Mobile'
    },
    'Birthday': {
        zh: '生日',
        en: 'Birthday'
    },
    'Save': {
        zh: '保存',
        en: 'Save'
    },
    'Modify Password': {
        zh: '修改密码',
        en: 'Modify Password'
    },
    'Contact': {
        zh: '联系人',
        en: 'Contact'
    },
    'Contacts': {
        zh: '联系人',
        en: 'Contacts'
    },
    'Online Contacts': {
        zh: '美位联系人',
        en: 'Online Contacts'
    },
    'Local Contacts': {
        zh: '手机通讯录',
        en: 'Local Contacts'
    },
    'Gifts': {
        zh: '礼品',
        en: 'Gifts'
    },
    'Anniversary': {
        zh: '纪念日',
        en: 'Anniversary'
    },
    'Add': {
        zh: '添加',
        en: 'Add'
    },
    'Title': {
        zh: '标题',
        en: 'Title'
    },
    'Date': {
        zh: '日期',
        en: 'Date'
    },
    'Delete': {
        zh: '删除',
        en: 'Delete'
    },
    'Pending Orders': {
        zh: '未完成订单',
        en: 'Pending Orders'
    },
    'Fulfilled Orders': {
        zh: '已完成订单',
        en: 'Fulfilled Orders'
    },
    'Detail': {
        zh: '详情',
        en: 'Detail'
    },
    'Checkin': {
        zh: '签到 &amp; 分享',
        en: 'Checkin'
    },
    'Settings': {
        zh: '设置',
        en: 'Settings'
    },
    'Language': {
        zh: '语言',
        en: 'Language'
    },
    'Search Hint': {
        zh: '输入关键字搜索餐厅',
        en: 'Search Restaurants'
    },
    'No Orders! Go and Book!': {
        zh: '还没有订单，赶紧预订！',
        en: 'No Orders! Go and Book!'
    },
    '两次密码输入不一致，请重新输入。': {
        zh: '',
        en: ''
    },
    'Please confirm the cancellation': {
        zh: '请确认删除订单',
        en: 'Cancel Order'
    },
    'An SMS will be sent to you to inform you the order has been confirmed': {
        zh: '订单被确认以后您会收到一条短信',
        en: 'An SMS will be sent to you to inform you the order has been confirmed'
    },
    'Cancel Order': {
        zh: '删除订单',
        en: 'Cancel Order'
    },
    'Confirm Order': {
        zh: '确认订单',
        en: 'Confirm Order'
    },
    'Confirm': {
        zh: '确认',
        en: 'Confirm'
    },
    'Cancel': {
        zh: '取消',
        en: 'Cancel'
    },
    'Close': {
        zh: '关闭',
        en: 'Close'
    },
    'Order No': {
        zh: '订单号',
        en: 'Order No'
    },
    'Order Date': {
        zh: '订单日期',
        en: 'Date'
    },
    'Order Time': {
        zh: '订单时间',
        en: 'Time'
    },
    'Peoples': {
        zh: '人数',
        en: 'Peoples'
    },
    'Discount': {
        zh: '折扣',
        en: 'Discount'
    },
    'Share to Moments': {
        zh: '分享到朋友圈',
        en: 'Share to Moments'
    },
    'Share to Weibo': {
        zh: '分享到微博',
        en: 'Share to Weibo'
    },
    'Purchase': {
        zh: '兑换',
        en: 'Purchase'
    },
    'credits left. One of our customer service will contact you soon as possible.': {
        zh: '剩余积分。我们的客服会马上联系您。',
        en: ' credits left. One of our customer service will contact you soon as possible.'
    },
    'Successfully! You have': {
        zh: '兑换成功！您还有',
        en: 'Successfully! You have '
    }
};

MeiweiApp.CheckI18n = function() {
    var newMsg = [];
    var checkExist = function(el) {
        var msg = $(el).attr('data-i18n');
        if (!MeiweiApp.i18n[msg]) newMsg.push(msg);
    }
    $('[data-i18n]').each(function() {
        checkExist(this);
    });
    for (var i in MeiweiApp.Templates) {
        var template = MeiweiApp.Templates[i]();
        $(template).find('[data-i18n]').each(function() {
            checkExist(this);
        });
        $(template).filter('[data-i18n]').each(function() {
            checkExist(this);
        });
    }
    return newMsg;
};

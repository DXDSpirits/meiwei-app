document.addEventListener("deviceready", function(e) {
    document.addEventListener("resume", function(e) {
        if (MeiweiApp.history.active) {
            MeiweiApp.history.active.refresh();
        }
    }, false);
    document.addEventListener("backbutton", function(e) {
        if (MeiweiApp.history.active != MeiweiApp.Pages.Home){
            e.preventDefault();
            if (MeiweiApp.history.active && MeiweiApp.history.active.onClickLeftBtn) {
                MeiweiApp.history.active.onClickLeftBtn();
            }
        }
    }, false);
    MeiweiApp.start();
}, false);

document.addEventListener('WeixinJSBridgeReady', function() {
    WeixinJSBridge.call('hideToolbar');
});

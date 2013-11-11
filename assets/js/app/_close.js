document.addEventListener("deviceready", MeiweiApp.start, false);
document.addEventListener("backbutton", function( e ) {
	if(MeiweiApp.history.active != MeiweiApp.Pages.Home){
		e.preventDefault();
        if (MeiweiApp.history.active && MeiweiApp.history.active.onClickLeftBtn) {
            MeiweiApp.history.active.onClickLeftBtn();
        }
	}
}, false);
document.addEventListener('WeixinJSBridgeReady', function() {
    WeixinJSBridge.call('hideToolbar');
});

});

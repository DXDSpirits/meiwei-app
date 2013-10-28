document.addEventListener("deviceready", MeiweiApp.start, false);
document.addEventListener("backbutton", function() {
    if (MeiweiApp.history.active && MeiweiApp.history.active.onClickLeftBtn) {
        MeiweiApp.history.active.onClickLeftBtn();
    } 
false);
});
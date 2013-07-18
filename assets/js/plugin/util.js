
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        
        $(".begin").css( "color" , "red" );
        MeiweiApp.googleMap.getLocation();

        
        //window.plugins.statusBarNotification.notify("Put your title here", "Put your sticky message here", Flag.FLAG_NO_CLEAR);
        
    }
};



$.extend( MeiweiApp, {
	googleMap : { 
		getLocation : function(){
			navigator.geolocation.getCurrentPosition( function( position ){
				console.log(position);
				alert(position.coords.latitude);
			} ,function( e ){
				console.log(e);
			} , { enableHighAccuracy:true,   maximumAge:30000,  timeout:27000});
		}
	}
}); 

//app.initialize();

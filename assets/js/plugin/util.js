$.extend(MeiweiApp, {
    googleMap: {
        getLocation: function() {
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log(position);
                alert(position.coords.latitude);
            },
            function(e) {
                console.log(e);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 27000
            });
        }
    }
});

//MeiweiApp.googleMap.getLocation();
navigator.contacts.find(["displayName", "phoneNumbers"],
function(contacts) {

    for (var i = 0; i < contacts.length; i++) {
        //alert("Display Name = " + contacts[i].displayName + ":" + contacts.phoneNumbers);
    }
},
function(e) {},
{});
//window.plugins.statusBarNotification.notify("Put your title here", "Put your sticky message here", Flag.FLAG_NO_CLEAR);
